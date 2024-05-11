import { useContext, useEffect, useState } from "react";
import useTitle from "../../../../hooks/useTitle";
import { AuthContext } from "../../../../provider/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const RegisterThirdpartyCompany = () => {
  useTitle("Register Thirdparty Company");
  const { register, handleSubmit, reset } = useForm();
  const { user } = useContext(AuthContext);
  const [allsts, setAllSTS] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSTS = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return (
            <div className="flex justify-center items-center h-full">
              <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#2145e6"
                ariaLabel="ball-triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          );
        }

        const response = await axios.get("http://localhost:3000/sts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllSTS(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchSTS();
  }, []);
  console.log(allsts);
  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#2145e6"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  const onSubmit = async (data) => {
    console.log(data);
    try {
      data.registrationId = data.contractId + Date.now();
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "http://localhost:3000/thirdparty/add-thirdparty",
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
      console.error("Error creating user:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 700,
      });
    }
  };
  return (
    <div className="card flex-shrink-0 md:w-2/5 mx-auto my-5 rounded p-5 bg-[#97979719] text-[#717070]">
      <div className="card-body">
        <h1 className="text-lg text-center font-semibold text-[#717070] p-5 uppercase">
          Fill-up the information
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-base grid lg:grid-cols-2 gap-2"
        >
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Company Name</span>
            </label>
            <input
              type="text"
              name="companyName"
              {...register("companyName")}
              placeholder="Arif Traders"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text">Contract ID</span>
            </label>
            <input
              type="text"
              name="contractId"
              {...register("contractId")}
              placeholder="DNCC-123456"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          {/* <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text">Registration ID</span>
            </label>
            <input
              type="text"
              name="designation"
              placeholder="Vice-chancellor"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
            />
          </div> */}
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text">Registration Date</span>
            </label>
            <input
              type="date"
              name="registrationDate"
              {...register("registrationDate")}
              placeholder="Vice-chancellor"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">
                TIN Number (12 Digit)
              </span>
            </label>
            <input
              type="number"
              name="tinNumber"
              {...register("tinNumber")}
              placeholder="DNCC3672"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Contact Number</span>
            </label>
            <input
              type="text"
              name="contact"
              {...register("contact")}
              placeholder="+8801991347811"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Workforce Size</span>
            </label>
            <input
              type="number"
              name="workforceSize"
              {...register("workforceSize")}
              placeholder="Dhaka Metro-Ha 678910"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">
                Payment Per Tonnage of Waste
              </span>
            </label>
            <input
              type="text"
              name="paymentPerTonWaste"
              {...register("paymentPerTonWaste")}
              placeholder="220.50"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">
                Required Waste Per Day (Ton)
              </span>
            </label>
            <input
              type="text"
              name="reqAmountWastePerDay"
              {...register("reqAmountWastePerDay")}
              placeholder="5"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Contract Duration</span>
            </label>
            <select
              id="contactDuration"
              name="contactDuration"
              {...register("contactDuration")}
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            >
              <option>Select Duration</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="12m">12 Months</option>
            </select>
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Area of Collection</span>
            </label>
            <input
              type="text"
              name="areaOfCollection"
              {...register("areaOfCollection")}
              placeholder="Dhaka Metro-Ha 678910"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex flex-col mt-1">
            <label className="label">
              <span className="label-text uppercase">Designated STS</span>
            </label>
            <select
              id="designatedSts"
              name="designatedSts"
              {...register("designatedSts")}
              className="select select-bordered bg-gray-100"
              required
            >
              <option value="">Select STS</option>
              {allsts.map((sts) => (
                <option key={sts._id} value={sts.stsId}>
                  Ward Number-{sts.ward_num}
                </option>
              ))}
            </select>
            {/* <input
              type="text"
              name="license"
              placeholder="Dhaka Metro-Ha 678910"
              className="input input-bordered bg-gray-100 rounded py-2 px-4 border border-gray-300  focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none"
            /> */}
          </div>
          <div className="form-control mt-6 flex justify-center pb-3">
            <input
              type="submit"
              value="Register"
              className="text-[#4765ebc3] border rounded p-1 lg:p-2 lg:-mb-6 font-semibold hover:bg-[#4765ebc3] hover:text-white border-[#4765ebc3] uppercase w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterThirdpartyCompany;
