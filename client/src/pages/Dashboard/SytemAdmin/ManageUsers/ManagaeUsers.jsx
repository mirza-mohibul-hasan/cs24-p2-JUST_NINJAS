import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../provider/AuthProvider";
import moment from "moment";
import useTitle from "../../../../hooks/useTitle";
const ManagaeUsers = () => {
  useTitle("Manage Users");
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  // Roles update
  const [newrole, setNewRole] = useState("");
  const [oldrole, setOldRole] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchTerm,
            sortBy: sortBy,
            sortOrder: sortOrder,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, sortBy, sortOrder, refetch]);
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
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    const selectedSortBy = e.target.value;
    setSortBy(e.target.value);
    if (selectedSortBy !== sortBy) {
      setSortOrder("asc");
    } else {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:3000/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          Swal.fire("Deleted!", "User has been deleted.", "success");
          setRefetch(!refetch);
          // console.log("User has been deleted successfully.");
        } else {
          Swal.fire("Error!", "Failed to delete user.", "error");
          console.error("Failed to delete user.");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "User deletion has been cancelled.", "error");
      }
    } catch (error) {
      console.error("Error deleting users:", error.message);
      setLoading(false);
    }
  };
  // Roles update
  const handleId = (id, oldRole) => {
    setUserId(id);
    setOldRole(oldRole);
  };
  const handleRoleUpdate = async (userId, newRole, oldRole) => {
    if (newRole === "" || oldRole == "") {
      return Swal.fire("Cancelled", "Please select a role.", "error");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.put(
        `http://localhost:3000/users/${userId}/roles`,
        { newRole, oldRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Success!", "User role updated successfully.", "success");
        setRefetch(!refetch);
      } else {
        Swal.fire("Error!", "Failed to update user role.", "error");
        console.error("Failed to update user role.");
      }
    } catch (error) {
      console.error("Error updating user role:", error.message);
    }
  };
  // console.log(user.email == "mirzamohibul618@gmail.com");
  return (
    <div className="overflow-x-auto">
      <dialog id="my_modal_3" className="modal dark:bg-gray-700">
        <form
          method="dialog"
          className="modal-box dark:bg-gray-800 dark:text-black"
        >
          <button
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h1 className="dark:text-white">Update Role</h1>
          <div className="flex flex-col p-5 gap-5">
            <select
              value={newrole}
              onChange={(e) => setNewRole(e.target.value)}
              className="select select-bordered w-full  select-primary select-sm"
            >
              <option value="">Update Role</option>
              <option value="sysadmin">System Admin</option>
              <option value="stsmanager">STS Manager</option>
              <option value="landmanager">Landfill Manager</option>
              <option value="unassigned">Unassigned</option>
            </select>
            <button
              className="bg-[#2145e6] text-white font-semibold rounded py-1"
              onClick={() => handleRoleUpdate(userId, newrole, oldrole)}
            >
              Update
            </button>
          </div>
        </form>
      </dialog>
      <div className="flex justify-center gap-2 p-3">
        <label className="input input-bordered input-primary flex items-center gap-2 input-sm w-full max-w-xs">
          <input
            type="text"
            className="grow "
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>

        {/* Sort by select */}
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="select select-bordered w-full max-w-xs select-primary select-sm dark:text-gray-700"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="createdAt">Register Date</option>
          {/* Add more options for other fields */}
        </select>

        {/* Sort order select */}
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="select select-bordered w-full max-w-xs select-primary select-sm dark:text-gray-700"
        >
          <option value="">Select Order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table className="table text-center dark:hover:text-black">
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
          {users?.map((rowuser, index) => (
            <tr key={rowuser._id} className="hover">
              <th>{index + 1}</th>
              <td>{rowuser.name ? rowuser.name : "Not Available"}</td>
              <td>{rowuser.email}</td>
              <td>{moment(rowuser.createdAt).format("LLL")}</td>
              <td>
                {rowuser.role == "sysadmin"
                  ? "System Admin"
                  : rowuser.role == "stsmanager"
                  ? "STS Manager"
                  : rowuser.role == "landmanager"
                  ? "Landfill Manager"
                  : "Unassigned"}
              </td>
              {rowuser?.email !== user?.email && (
                <td className="flex gap-2">
                  <Link to={`/dashboard/userdetails/${rowuser._id}`}>
                    <button className="btn btn-xs btn-primary btn-outline">
                      Details
                    </button>
                  </Link>

                  <Link to={`/dashboard/updateuser/${rowuser._id}`}>
                    <button className="btn btn-xs  btn-outline">Update</button>
                  </Link>
                  <button
                    onClick={() => {
                      window.my_modal_3.showModal();
                      handleId(rowuser._id, rowuser?.role);
                    }}
                    className="btn btn-xs btn-success  btn-outline"
                  >
                    Update Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(rowuser._id)}
                    className="btn btn-xs btn-error btn-outline"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagaeUsers;
