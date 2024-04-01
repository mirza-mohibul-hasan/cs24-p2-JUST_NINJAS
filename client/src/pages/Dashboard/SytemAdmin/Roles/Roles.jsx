import axios from "axios";
import { useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import useTitle from "../../../../hooks/useTitle";

const Roles = () => {
  useTitle("Roles");
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get("http://localhost:3000/users/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);
  if (roles.length == 0) {
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
      <ul className="steps steps-vertical">
        {roles?.map((role) => (
          <li key={role._id} className="step step-primary">
            {role.role == "sysadmin"
              ? "System Admin"
              : role.role == "stsmanager"
              ? "STS Manager"
              : role.role == "landmanager"
              ? "Land Manager"
              : "Unassigned"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roles;
