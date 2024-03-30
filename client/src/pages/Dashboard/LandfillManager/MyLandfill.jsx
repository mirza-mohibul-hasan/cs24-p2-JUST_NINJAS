import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";

const MyLandfill = () => {
  const [myLandfill, setMyLandfill] = useState(null);
  const [landfillManagers, setLandfillManagers] = useState([]);
  // const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchLandfill = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) {
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/landfill/manager-info/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyLandfill(response.data?.landfillInfo);
        setLandfillManagers(response.data?.managerInfo);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchLandfill();
  }, [user]);

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
  if (!myLandfill && !landfillManagers) {
    return <p>You Do not Have STS</p>;
  }
  return (
    <div>
      <h1 className="text-5xl">You have Landfill</h1>
      <p>Area Name: {myLandfill?.areaName}</p>
      <p>Capacity: {myLandfill?.capacity}</p>
      <p>
        Lattitude: {myLandfill?.latitude} & Longitude: {myLandfill?.longitude}
      </p>
      <p>Open: {myLandfill?.starttime}</p>
      <p>Close: {myLandfill?.endtime}</p>
    </div>
  );
};

export default MyLandfill;
