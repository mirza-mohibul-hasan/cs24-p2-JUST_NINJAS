import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import STSManager from "./STSManager";
import STSVehicle from "./STSVehicle";
import moment from "moment";
import useTitle from "../../../../hooks/useTitle";

const ManageSTS = () => {
  useTitle("Manage STS");
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
  // console.log(allsts);
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
  return (
    <div className="overflow-x-auto">
      <h1 className="text-5xl font-semibold mb-3">MANAGE STS</h1>
      <table className="table text-center dark:hover:text-black">
        <thead>
          <tr className="bg-blue-200">
            <th>SN</th>
            <th>Ward</th>
            <th>Capacity</th>
            <th>Latitude & Longitude</th>
            <th>Registered At</th>
            <th>Managers</th>
            <th>Vehicles</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allsts?.map((sts, index) => (
            <tr key={sts._id} className="hover">
              <th>{index + 1}</th>
              <td>{sts.ward_num}</td>
              <td>{sts.capacity}</td>
              <td>
                {sts.latitude} & {sts.longitude}
              </td>
              <td>{moment(sts.regAt).format("LLL")}</td>
              <STSManager stsId={sts.stsId}></STSManager>
              <STSVehicle stsId={sts.stsId}></STSVehicle>
              <td>
                <Link to={`/dashboard/managests/${sts.stsId}`}>
                  <button className="btn btn-xs btn-primary btn-outline">
                    Update
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSTS;
