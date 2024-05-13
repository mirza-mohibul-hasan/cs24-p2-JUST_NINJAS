import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useTitle from "../../../hooks/useTitle";

const FleetOfTruck = () => {
  useTitle("Fleet of Trucks");
  const { register, handleSubmit, reset } = useForm();
  const [mySTS, setMySTS] = useState(null);
  const [stsInfo, setStsInfo] = useState(null);
  const [fleetOfTrucks, setFleetOfTrucks] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchSTS = async () => {
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

    fetchSTS();
  }, [user]);
  useEffect(() => {
    const fetchSTSDetails = async () => {
      try {
        if (!mySTS) return;

        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/sts/single-info/${mySTS.stsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStsInfo(response.data);
      } catch (error) {
        console.error("Error fetching assigned vehicles:", error.message);
      }
    };

    fetchSTSDetails();
  }, [mySTS]);
  if (!mySTS) {
    return <p className="text-5xl text-center">You Do not Have STS</p>;
  }
  if (loading || !stsInfo || !mySTS) {
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
    return <p>You Do not Have STS</p>;
  }
  const onSubmit = async (data) => {
    if (!mySTS) {
      alert("Please refresh");
    }

    data.wasteNeedToShift = parseFloat(data.wasteNeedToShift);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.get(
        `http://localhost:3000/sts-manager/fleet-opt/${mySTS.stsId}/${data.wasteNeedToShift}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (response.data) {
        setFleetOfTrucks(response.data);
        Swal.fire({
          icon: "success",
          title: "Fleet Calculation Succesfull",
          text: "Congratulations",
        });
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Fleet Calculation Failed",
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
    <div>
      <h1 className="text-5xl text-center border-b-2 border-blue-500 p-2">
        Your STS Details
      </h1>
      <p>CAPACITY: {stsInfo?.capacity}</p>
      <p>Ward Number: {stsInfo?.ward_num}</p>
      <p>Lattitude:{stsInfo?.latitude}</p>
      <p>Longitude: {stsInfo?.longitude}</p>
      <div className=" ">
        <div className="hero-content w-full">
          <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-[#dadff3]">
            <div className="card-body">
              <h1 className="text-3xl text-center font-bold text-[#2145e6]">
                Calculate Fleet of Trucks
              </h1>
              <p className="text-[#2145e6] text-center border border-[#2145e6] rounded-lg font-semibold"></p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Weight of Waste You have to Transfer in (TON){" "}
                    </span>
                  </label>
                  <input
                    type="text"
                    defaultValue={stsInfo?.capacity}
                    id="wasteNeedToShift"
                    name="wasteNeedToShift"
                    {...register("wasteNeedToShift")}
                    placeholder="Enter  weight of Waste in TON"
                    className="input input-bordered bg-gray-100 dark:text-black"
                    required
                  />
                </div>
                <div className="form-control mt-6 ">
                  <input
                    className="text-white btn bg-[#2145e6] border-[#2145e6]"
                    type="submit"
                    value="Calculate"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {fleetOfTrucks && (
        <>
          <h1 className="text-3xl">Required Trucks:</h1>
          <div className="overflow-x-auto">
            <table className="table text-center dark:hover:text-black">
              <thead>
                <tr className="bg-blue-200">
                  <th>SN</th>
                  <th>Registration Num</th>
                  <th>How Much Trip</th>
                  <th>Capacity</th>
                  <th>Type</th>
                  <th>Fuel Cost(Loaded)</th>
                  <th>Fuel Cost(Unloaded)</th>
                </tr>
              </thead>
              <tbody>
                {fleetOfTrucks?.map((vehicle, index) => (
                  <tr key={vehicle._id} className="hover">
                    <th>{index + 1}</th>
                    <td>{vehicle.registration_number}</td>
                    <td>{vehicle.numTrip}</td>
                    <td>{vehicle.capacity}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.fuel_cost_loaded}</td>
                    <td>{vehicle.fuel_cost_unloaded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default FleetOfTruck;
