import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
const useUserType = () => {
  const { loading } = useContext(AuthContext);
  const [role, setRole] = useState("general");
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found for roles");
        }

        const response = await axios.get("http://localhost:3000/rbac/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRole(response.data?.role);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchRoles();
  }, [loading]);
  return role;
};

export default useUserType;
