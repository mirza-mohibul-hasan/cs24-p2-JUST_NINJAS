import axios from "axios";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
const STSManager = ({ stsId }) => {
  const [managers, setManagers] = useState([]);
  useEffect(() => {
    const fetchSTS = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/sts/assignedstsmanager/${stsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setManagers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchSTS();
  }, [stsId]);
  return (
    <td>
      {managers?.map((manager) => (
        <span
          key={manager._id}
          className="flex items-center gap-1 border rounded"
        >
          <CgProfile />
          <p>{manager.name}</p>
        </span>
      ))}
    </td>
  );
};

export default STSManager;
