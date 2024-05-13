import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";
import { AuthContext } from "../../../provider/AuthProvider";
import { Link } from "react-router-dom";
import useTitle from "../../../hooks/useTitle";

const Profile = () => {
  useTitle("Profile");
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

        const response = await axios.get(`http://localhost:3000/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(response.data.user);
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
  return (
    <div>
      <div className="">
        <div className="w-32 mx-auto rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mt-5">
          <img
            className="w-32 rounded-full"
            src={`http://localhost:3000/profilepic/${userDetails?.avatar}`}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 my-3 text-xl font-semibold">
        <h1>Name: {userDetails?.name}</h1>
        <h1>Email: {userDetails?.email}</h1>

        {userDetails?.address && <h1>Address: {userDetails?.address}</h1>}
        {userDetails?.nid && <h1>NID: {userDetails?.nid}</h1>}
        <h1>
          Role:
          {userDetails.role == "sysadmin"
            ? "System Admin"
            : userDetails.role == "stsmanager"
            ? "STS Manager"
            : userDetails.role == "landmanager"
            ? "Landfill Manager"
            : userDetails.role == "contractormanager"
            ? "Contractor Manager"
            : userDetails.role == "workforce"
            ? "Workforce"
            : "Unassigned"}
        </h1>
      </div>

      <div className="flex gap-5 justify-center">
        <Link to="/dashboard/updateprofile">
          <button className="btn btn-sm btn-active ">Update Profile</button>
        </Link>
        <Link to="/dashboard/changepassword">
          <button className="btn btn-sm btn-active ">Change Password</button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
