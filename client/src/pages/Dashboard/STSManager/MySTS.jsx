import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";

const MySTS = () => {
  const [mySTS, setMySTS] = useState(null);
  const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchUsers = async () => {
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
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchUsers();
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
  console.log(myVehicles);
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
    return <p>You Do not Have STS</p>;
  }
  return (
    <div>
      <h1>You have sts</h1>
      <h1 className="text-5xl my-3">Assigned Vehicles</h1>
      <div className="overflow-x-auto">
        <table className="table text-center">
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
