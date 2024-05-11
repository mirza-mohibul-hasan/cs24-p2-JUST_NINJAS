import { useContext, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useTitle from "../../../hooks/useTitle";

const STSVehicleExit = () => {
  useTitle("Vehicle Entry");
  const [mySTS, setMySTS] = useState(null);
  const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) {
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/sts/manager-info/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMySTS(response.data);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
  useEffect(() => {
    const fetchAssignedVehicles = async () => {
      try {
        if (!mySTS) return;

        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/sts/assigned-vehicle/${mySTS.stsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyVehicles(response.data);
      } catch (error) {
        console.error("Error fetching assigned vehicles:", error.message);
      }
    };

    fetchAssignedVehicles();
  }, [mySTS]);
  // console.log(myVehicles);
  if (loading) {
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
  if (!mySTS) {
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
    if (!mySTS) {
      alert("Please refresh");
    }

    data.stsId = mySTS.stsId;
    data.weightOfWaste = parseFloat(data.weightOfWaste);

    data.stsEntryId = (data.vehicleId + data.weightOfWaste + Date.now())
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    data.addedBy = user?.email;
    // console.log(data);
    try {
      console.log(data);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "http://localhost:3000/sts-manager/add-vehicle-leave-sts",
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
    <div className=" min-h-screen">
      <div className="hero-content w-full">
        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-[#dadff3]">
          <div className="card-body">
            <h1 className="text-3xl text-center font-bold text-[#2145e6]">
              ADD VEHICLE ENTRY
            </h1>
            <p className="text-[#2145e6] text-center border border-[#2145e6] rounded-lg font-semibold"></p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Vehicle Number</span>
                </label>
                <select
                  id="vehicleId"
                  name="vehicleId"
                  {...register("vehicleId")}
                  className="select select-bordered bg-gray-100"
                  required
                >
                  <option value="">Select Truck</option>
                  {myVehicles.map((vehicle) => (
                    <option
                      key={vehicle._id}
                      value={vehicle.vehicleId}
                      className="uppercase"
                    >
                      {vehicle.type} {vehicle.registration_number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Weight of Waste (kg)</span>
                </label>
                <input
                  type="text"
                  id="weightOfWaste"
                  name="weightOfWaste"
                  {...register("weightOfWaste")}
                  placeholder="Enter weight in TON"
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Time of Arrival</span>
                </label>
                <input
                  type="datetime-local"
                  id="timeOfArrival"
                  name="timeOfArrival"
                  {...register("timeOfArrival")}
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Time of Departure</span>
                </label>
                <input
                  type="datetime-local"
                  id="timeOfDeparture"
                  name="timeOfDeparture"
                  {...register("timeOfDeparture")}
                  className="input input-bordered bg-gray-100"
                  required
                />
              </div>
              <div className="form-control mt-6 ">
                <input
                  className="text-white btn bg-[#2145e6] border-[#2145e6]"
                  type="submit"
                  value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STSVehicleExit;
