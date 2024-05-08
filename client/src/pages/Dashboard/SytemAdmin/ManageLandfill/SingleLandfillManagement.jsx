import axios from "axios";
import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useTitle from "../../../../hooks/useTitle";

const SingleLandfillManagement = () => {
  useTitle("Landfill Info");
  const [assignedmanagers, setAssignedManagers] = useState([]);
  const [availablemanagers, setAvailableManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);
  const { landfillId } = useParams();
  useEffect(() => {
    const fetchSTS = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response1 = await axios.get(
          `http://localhost:3000/landfill/assigned-landfill-manager/${landfillId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignedManagers(response1.data);
        const response2 = await axios.get(
          `http://localhost:3000/landfill/available-landfill-manager`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvailableManagers(response2.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error.message);
      }
    };

    fetchSTS();
  }, [landfillId, refetch]);
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
  const handleRemove = async (managerId, landfillId) => {
    try {
      //   console.log(managerId, landfillId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.delete(
        "http://localhost:3000/landfill/remove-manager",
        {
          data: { managerId, landfillId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          text: "Congratulations",
        });
        setRefetch(!refetch);
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
  const handleAssign = async (managerId, landfillId) => {
    try {
      //   console.log(managerId, landfillId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "http://localhost:3000/landfill/assign-manager",
        { managerId, landfillId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          text: "Congratulations",
        });
        setRefetch(!refetch);
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
    <div>
      <h1 className="text-5xl">Assigned Managers</h1>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr className="bg-blue-200">
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Register Date</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedmanagers?.map((manager, index) => (
              <tr key={manager._id} className="hover">
                <th>{index + 1}</th>
                <td>{manager.name ? manager.name : "Not Available"}</td>
                <td>{manager.email}</td>
                <td>{manager.createdAt}</td>
                <td>
                  {manager.role == "sysadmin"
                    ? "System Admin"
                    : manager.role == "stsmanager"
                    ? "STS Manager"
                    : manager.role == "landmanager"
                    ? "Landfill Manager"
                    : "Unassigned"}
                </td>
                <td>
                  {" "}
                  <button
                    onClick={() => handleRemove(manager._id, landfillId)}
                    className="btn btn-xs btn-error btn-outline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1 className="text-5xl">Available Managers</h1>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr className="bg-blue-200">
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Register Date</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availablemanagers?.map((manager, index) => (
              <tr key={manager._id} className="hover">
                <th>{index + 1}</th>
                <td>{manager.name ? manager.name : "Not Available"}</td>
                <td>{manager.email}</td>
                <td>{manager.createdAt}</td>
                <td>
                  {manager.role == "sysadmin"
                    ? "System Admin"
                    : manager.role == "stsmanager"
                    ? "STS Manager"
                    : manager.role == "landmanager"
                    ? "Landfill Manager"
                    : "Unassigned"}
                </td>
                <td>
                  {" "}
                  <button
                    onClick={() => handleAssign(manager._id, landfillId)}
                    className="btn btn-xs btn-success btn-outline"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SingleLandfillManagement;
