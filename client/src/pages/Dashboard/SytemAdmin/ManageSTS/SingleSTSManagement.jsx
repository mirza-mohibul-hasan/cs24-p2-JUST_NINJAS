import axios from "axios";
import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useTitle from "../../../../hooks/useTitle";

const SingleSTSManagement = () => {
  useTitle("STS Info");
  const [assignedmanagers, setAssignedManagers] = useState([]);
  const [availablemanagers, setAvailableManagers] = useState([]);
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);
  const { stsId } = useParams();
  useEffect(() => {
    const fetchSTS = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        // assigned manager
        const response1 = await axios.get(
          `http://localhost:3000/sts/assignedstsmanager/${stsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignedManagers(response1.data);
        // assigned vehilces
        const response2 = await axios.get(
          `http://localhost:3000/sts/assigned-vehicle/${stsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignedVehicles(response2.data);
        // available managers
        const response3 = await axios.get(
          `http://localhost:3000/sts/availablestsmanager`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvailableManagers(response3.data);
        // available vehicles
        const response4 = await axios.get(
          `http://localhost:3000/sts/available-vehicles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvailableVehicles(response4.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching users:", error.message);
      }
    };

    fetchSTS();
  }, [stsId, refetch]);
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
  const handleRemoveManager = async (managerId, stsId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.delete(
        "http://localhost:3000/sts/remove-manager",
        {
          data: { managerId, stsId },
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
  const handleAssignManager = async (managerId, stsId) => {
    try {
      //   console.log(managerId, stsId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "http://localhost:3000/sts/assign-manager",
        { managerId, stsId },
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
  const handleRemoveVehicle = async (vehicleId, stsId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.delete(
        "http://localhost:3000/sts/remove-vehicle",
        {
          data: { vehicleId, stsId },
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
  const handleAssignVehicle = async (vehicleId, stsId) => {
    try {
      //   console.log(managerId, stsId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.post(
        "http://localhost:3000/sts/assign-vehicle",
        { vehicleId, stsId },
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
      <h1 className="text-5xl mb-3">Assigned Managers</h1>
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
                    onClick={() => handleRemoveManager(manager._id, stsId)}
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedVehicles?.map((vehicle, index) => (
              <tr key={vehicle._id} className="hover">
                <th>{index + 1}</th>
                <td>{vehicle.registration_number}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.fuel_cost_loaded}</td>
                <td>{vehicle.fuel_cost_unloaded}</td>
                <td>
                  <button
                    onClick={() =>
                      handleRemoveVehicle(vehicle.vehicleId, stsId)
                    }
                    className="btn btn-xs btn-error btn-outline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1 className="text-5xl my-3">Available Managers</h1>
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
                    onClick={() => handleAssignManager(manager._id, stsId)}
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
      <h1 className="text-5xl my-3">Available Vehicles</h1>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableVehicles?.map((vehicle, index) => (
              <tr key={vehicle._id} className="hover">
                <th>{index + 1}</th>
                <td>{vehicle.registration_number}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.fuel_cost_loaded}</td>
                <td>{vehicle.fuel_cost_unloaded}</td>
                <td>
                  <button
                    onClick={() =>
                      handleAssignVehicle(vehicle.vehicleId, stsId)
                    }
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

export default SingleSTSManagement;
