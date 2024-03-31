import axios from "axios";
import { useEffect, useState } from "react";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get("http://localhost:3000/users/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);
  // console.log(roles);
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
