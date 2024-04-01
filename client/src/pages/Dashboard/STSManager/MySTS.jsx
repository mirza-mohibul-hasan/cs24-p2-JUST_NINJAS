import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import useTitle from "../../../hooks/useTitle";

const MySTS = () => {
  useTitle("My STS");
  const [mySTS, setMySTS] = useState(null);
  const [stsInfo, setStsInfo] = useState(null);
  const [myVehicles, setMyVehicles] = useState([]);
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
    return (
      <div className="flex justify-center flex-col items-center h-full">
        <p className="text-5xl text-center">You Do not Have STS</p>
      </div>
    );
  }
  if (loading || !stsInfo) {
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

  return (
    <div>
      <h1 className="text-5xl text-center border-b-2 border-blue-500 p-2">
        Your STS Details
      </h1>
      <p>CAPACITY: {stsInfo?.capacity}</p>
      <p>Ward Number: {stsInfo?.ward_num}</p>
      <p>Lattitude:{stsInfo?.latitude}</p>
      <p>Longitude: {stsInfo.longitude}</p>
      <h1 className="text-3xl my-3">Assigned Vehicles:</h1>
      <div className="overflow-x-auto">
        <table className="table text-center dark:hover:text-black">
          <thead>
            <tr className="bg-blue-200">
              <th>SN</th>
              <th>Registration Num</th>
              <th>Capacity</th>
              <th>Type</th>
              <th>Fuel Cost(Loaded)</th>
              <th>Fuel Cost(Unloaded)</th>
            </tr>
          </thead>
          <tbody>
            {myVehicles?.map((vehicle, index) => (
              <tr key={vehicle._id} className="hover">
                <th>{index + 1}</th>
                <td>{vehicle.registration_number}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.fuel_cost_loaded}</td>
                <td>{vehicle.fuel_cost_unloaded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySTS;
