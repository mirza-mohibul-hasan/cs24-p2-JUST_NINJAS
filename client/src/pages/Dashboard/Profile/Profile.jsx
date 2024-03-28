import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { AuthContext } from "../../../provider/AuthProvider";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) {
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/users/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);
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
  const changePassword = async () => {
    console.log("Change Password Called");
  };
  return (
    <div>
      <h1>Name: {userDetails?.name}</h1>
      <h1>Email: {userDetails?.email}</h1>
      <button className="btn btn-outline">EDIT</button>
      <Link to="/dashboard/changepassword">
        <button onClick={changePassword} className="btn btn-outline">
          Change Password
        </button>
      </Link>
    </div>
  );
};

export default Profile;
