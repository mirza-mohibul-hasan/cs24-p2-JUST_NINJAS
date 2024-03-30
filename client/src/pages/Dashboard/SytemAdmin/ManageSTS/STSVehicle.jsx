import axios from "axios";
import { useEffect, useState } from "react";
import { FaTruckPickup } from "react-icons/fa";
const STSVehicle = ({ stsId }) => {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    const fetchSTS = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/sts/assigned-vehicle/${stsId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchSTS();
  }, [stsId]);
  return (
    <td>
      {vehicles?.map((vehicle) => (
        <span
          key={vehicle._id}
          className="flex items-center gap-1 border rounded"
        >
          <FaTruckPickup />
          <p>{vehicle.registration_number}</p>
        </span>
      ))}
    </td>
  );
};
export default STSVehicle;
