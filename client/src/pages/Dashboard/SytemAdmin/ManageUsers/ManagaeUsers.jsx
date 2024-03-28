import axios from "axios";
import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
const ManagaeUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
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
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="bg-blue-200">
            <th>SN</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={user._id} className="hover">
              <th>{index + 1}</th>
              <td>{user.name ? user.name : "Not Available"}</td>
              <td>{user.email}</td>
              <td>
                {user.role == "sysadmin"
                  ? "System Admin"
                  : user.role == "stsmanager"
                  ? "STS Manager"
                  : user.role == "landmanager"
                  ? "Land Manager"
                  : "Unassigned"}
              </td>
              <td>
                <button className="btn btn-xs btn-outline">Details</button>
                <button className="btn btn-xs  btn-outline">Update</button>
                <button className="btn btn-xs  btn-outline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagaeUsers;
