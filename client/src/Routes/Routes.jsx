import { createBrowserRouter } from "react-router-dom";
import DummyAuth from "../pages/DummyAuth/DummyAuth";
import Login from "../pages/Authentication/Login";
import MainLayout from "../layout/MainLayout";
import RestPassword from "../pages/Authentication/RestPassword";
import OTPVerification from "../pages/Authentication/OTPVerification";
import Home from "../pages/Home/Home";
import DashboardLayout from "../layout/DashboardLayout";
import DashHome from "../pages/Dashboard/DashHome/DashHome";
import CreateUser from "../pages/Dashboard/SytemAdmin/CreateUser.jsx/CreateUser";
import Profile from "../pages/Dashboard/Profile/Profile";
import ChangePassword from "../pages/Authentication/ChangePassword";
import ManagaeUsers from "../pages/Dashboard/SytemAdmin/ManageUsers/ManagaeUsers";
import UpdateUser from "../pages/Dashboard/SytemAdmin/ManageUsers/UpdateUser";
import UserDetails from "../pages/Dashboard/SytemAdmin/ManageUsers/UserDetails";
import UpdateProfile from "../pages/Dashboard/Profile/UpdateProfile";
import Roles from "../pages/Dashboard/SytemAdmin/Roles/Roles";
import UpdateUserRole from "../pages/Dashboard/SytemAdmin/ManageUsers/UpdateUserRole";
import AddVehicle from "../pages/Dashboard/SytemAdmin/ManageVehicles/AddVehicle";
import CreateSTS from "../pages/Dashboard/SytemAdmin/ManageSTS/CreateSTS";
import CreateLandfill from "../pages/Dashboard/SytemAdmin/ManageLandfill/CreateLandfill";
import ManageSTS from "../pages/Dashboard/SytemAdmin/ManageSTS/ManageSTS";
import SingleSTSManagement from "../pages/Dashboard/SytemAdmin/ManageSTS/SingleSTSManagement";
import ManageLandfill from "../pages/Dashboard/SytemAdmin/ManageLandfill/ManageLandfill";
import SingleLandfillManagement from "../pages/Dashboard/SytemAdmin/ManageLandfill/SingleLandfillManagement";
import STSVehicleEntry from "../pages/Dashboard/STSManager/STSVehicleEntry";
import MySTS from "../pages/Dashboard/STSManager/MySTS";
import MyLandfill from "../pages/Dashboard/LandfillManager/MyLandfill";
import LandfillVehicleEntry from "../pages/Dashboard/LandfillManager/LandfillVehicleEntry";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/dummyauth",
        element: <DummyAuth></DummyAuth>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/resetpassword",
        element: <RestPassword></RestPassword>,
      },
      {
        path: "/otpverification",
        element: <OTPVerification></OTPVerification>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      { path: "home", element: <DashHome></DashHome> },
      { path: "profile", element: <Profile></Profile> },
      { path: "updateprofile", element: <UpdateProfile></UpdateProfile> },
      {
        path: "changepassword",
        element: <ChangePassword></ChangePassword>,
      },
      {
        path: "manageusers",
        element: <ManagaeUsers></ManagaeUsers>,
      },
      {
        path: "createuser",
        element: <CreateUser></CreateUser>,
      },
      {
        path: "updateuser/:id",
        element: <UpdateUser></UpdateUser>,
      },
      {
        path: "userdetails/:id",
        element: <UserDetails></UserDetails>,
      },
      {
        path: "roles",
        element: <Roles></Roles>,
      },
      {
        path: "updateuserrole/:id",
        element: <UpdateUserRole></UpdateUserRole>,
      },
      // Vehicle Related
      {
        path: "addvehicle",
        element: <AddVehicle></AddVehicle>,
      },
      // STS Related
      {
        path: "creatests",
        element: <CreateSTS></CreateSTS>,
      },
      {
        path: "managests",
        element: <ManageSTS></ManageSTS>,
      },
      {
        path: "managests/:stsId",
        element: <SingleSTSManagement></SingleSTSManagement>,
      },
      // landfill
      {
        path: "createlandfill",
        element: <CreateLandfill></CreateLandfill>,
      },
      {
        path: "managelandfill",
        element: <ManageLandfill></ManageLandfill>,
      },
      {
        path: "managelandfill/:landfillId",
        element: <SingleLandfillManagement></SingleLandfillManagement>,
      },

      // STS Manager Route
      {
        path: "mysts",
        element: <MySTS></MySTS>,
      },
      {
        path: "sts-vehicle-entry",
        element: <STSVehicleEntry></STSVehicleEntry>,
      },
      // Landfill Manager Route
      {
        path: "mylandfill",
        element: <MyLandfill></MyLandfill>,
      },
      {
        path: "landfill-vehicle-entry",
        element: <LandfillVehicleEntry></LandfillVehicleEntry>,
      },
    ],
  },
]);
export default router;
