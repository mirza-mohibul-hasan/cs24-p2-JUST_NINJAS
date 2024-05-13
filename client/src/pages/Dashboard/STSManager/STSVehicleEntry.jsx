import { useContext, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useTitle from "../../../hooks/useTitle";

const STSVehicleEntry = () => {
  useTitle("Vehicle Entry");
  const [stsInfo, setStsInfo] = useState(null);
  const [contractorsInfo, setContractorsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token || !user) {
          return (
            <div className="flex justify-center flex-col items-center h-full">
              <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#ff0000"
                ariaLabel="ball-triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          );
        }
        const response = await axios.get(
          `http://localhost:3000/sts-manager/details-for-entry/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setStsInfo(response.data?.stsInfo);
        setContractorsInfo(response.data?.contractorsInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
  if (loading || !stsInfo) {
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <p className="text-5xl text-center">You Do not Have STS</p>
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#ff0000"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  const onSubmit = async (data) => {
    data.wasteCollectedKg = parseFloat(data.wasteCollectedKg);
    data.designatedSts = stsInfo._id;
    try {
      console.log(data);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "http://localhost:3000/sts-manager/add-vehicle-enter-sts",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          text: "Congratulations",
        });
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: response.data?.message,
          text: "Try Agin Later",
        });
      }
    } catch (error) {
      console.error("Error Adding Entry:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 700,
      });
    }
  };
  console.log(contractorsInfo);
  return (
    <div className="card flex-shrink-0 md:w-2/5 mx-auto my-5 rounded p-5 bg-[#97979719] text-[#717070]">
      <div className="card-body">
        <h1 className="text-lg text-center font-semibold text-[#717070] px-5 uppercase">
          Fill-up the information
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="text-base uppercase">
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Entry Time</span>
            </label>
            <input
              type="datetime-local"
              name="timeDate"
              {...register("timeDate")}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text">Waste Collected in KG</span>
            </label>
            <input
              type="text"
              name="wasteCollectedKg"
              {...register("wasteCollectedKg")}
              placeholder="200.5"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>

          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">
                Type of Waste Collected
              </span>
            </label>
            <select
              id="wasteType"
              name="wasteType"
              {...register("wasteType")}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            >
              <option>Select Type</option>
              <option value="domestic">Domestic Waste</option>
              <option value="Plastic">Plastic Waste</option>
              <option value="construction">Construction Waste</option>
            </select>
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Select Contractor ID</span>
            </label>
            <select
              id="contractorId"
              name="contractorId"
              {...register("contractorId")}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            >
              <option>Select ID</option>
              {contractorsInfo?.map((contractor) => (
                <option key={contractor._id} value={contractor?.registrationId}>
                  {contractor.companyName} {contractor.registrationId}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text">Designated sts for deposit</span>
            </label>
            <input
              disabled
              type="text"
              value={"STS OF WARD-" + stsInfo.ward_num}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300 focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">
                Vehicle Used for Transportation
              </span>
            </label>
            <select
              id="vehicle"
              name="vehicle"
              {...register("vehicle")}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            >
              <option>Select Vehicle</option>
              <option value="utilityvans">Utility Vans</option>
              <option value="minitruck">Mini Truck</option>
            </select>
          </div>
          <div className="form-control mt-6 flex justify-center pb-3">
            <input
              type="submit"
              value="ADD ENTRY"
              className="text-[#4765ebc3] border rounded p-1 font-semibold hover:bg-[#4765ebc3] hover:text-white border-[#4765ebc3] uppercase w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default STSVehicleEntry;
