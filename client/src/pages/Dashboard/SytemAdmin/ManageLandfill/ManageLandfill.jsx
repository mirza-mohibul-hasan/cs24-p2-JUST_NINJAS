import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../provider/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import LandfillManager from "./LandfillManager";
import { Link } from "react-router-dom";
import moment from "moment";
import useTitle from "../../../../hooks/useTitle";

const ManageLandfill = () => {
  useTitle("Manage Landfill");
  const { user } = useContext(AuthContext);
  const [allLandfill, setAllLandfill] = useState([]);
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

        const response = await axios.get(
          "http://localhost:3000/landfill/all-landfill",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllLandfill(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchSTS();
  }, []);
  //   console.log(allLandfill);
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
      <h1 className="text-5xl font-semibold mb-3">MANAGE LANDFILL</h1>
      <table className="table text-center dark:hover:text-black">
        <thead>
          <tr className="bg-blue-200">
            <th>SN</th>
            <th>Area Name</th>
            <th>Capacity</th>
            <th>Latitude & Longitude</th>
            <th>Operation Period</th>
            <th>Registered At</th>
            <th>Managers</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allLandfill?.map((landfill, index) => (
            <tr key={landfill._id} className="hover">
              <th>{index + 1}</th>
              {/* <td>{landfill.ward_num}</td> */}
              <td>{landfill.areaName}</td>
              <td>{landfill.capacity}</td>
              <td>
                {landfill.latitude} & {landfill.longitude}
              </td>
              <td>{landfill.starttime}</td>
              <td>{moment(landfill.regAt).format("LLL")}</td>
              <LandfillManager
                landfillId={landfill.landfillId}
              ></LandfillManager>
              <td>
                <Link to={`/dashboard/managelandfill/${landfill.landfillId}`}>
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

export default ManageLandfill;
