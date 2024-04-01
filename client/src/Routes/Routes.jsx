import { createBrowserRouter } from "react-router-dom";
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
import RouteView from "../pages/Dashboard/STSManager/RouteView";
import BillingReport from "../pages/Dashboard/LandfillManager/BillingReport";
import FleetOfTruck from "../pages/Dashboard/STSManager/FleetOfTruck";
import CreateRoles from "../pages/Dashboard/SytemAdmin/Roles/CreateRoles";
import ErrorPage from "../pages/Error/ErrorPage";
import AdminRoute from "./AdminRoute";
import STSManagerRoute from "./STSManagerRoute";
import LandfillManagerRoute from "./LandfillManagerRoute";
import PrivateRoute from "./PrivateRoute";
import AllBilling from "../pages/Dashboard/SytemAdmin/Billng/AllBilling";
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage></ErrorPage>,
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
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
      {
        path: "home",
        element: (
          <PrivateRoute>
            <DashHome></DashHome>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: "updateprofile",
        element: (
          <PrivateRoute>
            <UpdateProfile></UpdateProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "changepassword",
        element: (
          <PrivateRoute>
            <ChangePassword></ChangePassword>
          </PrivateRoute>
        ),
      },
      {
        path: "manageusers",
        element: (
          <AdminRoute>
            <ManagaeUsers></ManagaeUsers>
          </AdminRoute>
        ),
      },
      {
        path: "createuser",
        element: (
          <AdminRoute>
            <CreateUser></CreateUser>
          </AdminRoute>
        ),
      },
      {
        path: "updateuser/:id",
        element: (
          <AdminRoute>
            <UpdateUser></UpdateUser>
          </AdminRoute>
        ),
      },
      {
        path: "userdetails/:id",
        element: (
          <AdminRoute>
            <UserDetails></UserDetails>
          </AdminRoute>
        ),
      },
      {
        path: "create-role",
        element: (
          <AdminRoute>
            <CreateRoles></CreateRoles>
          </AdminRoute>
        ),
      },
      {
        path: "roles",
        element: <Roles></Roles>,
      },
      {
        path: "all-billing",
        element: (
          <AdminRoute>
            <AllBilling></AllBilling>
          </AdminRoute>
        ),
      },
      // Vehicle Related
      {
        path: "addvehicle",
        element: (
          <AdminRoute>
            <AddVehicle></AddVehicle>
          </AdminRoute>
        ),
      },
      // STS Related
      {
        path: "creatests",
        element: (
          <AdminRoute>
            <CreateSTS></CreateSTS>
          </AdminRoute>
        ),
      },
      {
        path: "managests",
        element: (
          <AdminRoute>
            <ManageSTS></ManageSTS>
          </AdminRoute>
        ),
      },
      {
        path: "managests/:stsId",
        element: (
          <AdminRoute>
            <SingleSTSManagement></SingleSTSManagement>
          </AdminRoute>
        ),
      },

      // landfill

      {
        path: "createlandfill",
        element: (
          <AdminRoute>
            <CreateLandfill></CreateLandfill>
          </AdminRoute>
        ),
      },
      {
        path: "managelandfill",
        element: (
          <AdminRoute>
            <ManageLandfill></ManageLandfill>
          </AdminRoute>
        ),
      },
      {
        path: "managelandfill/:landfillId",
        element: (
          <AdminRoute>
            <SingleLandfillManagement></SingleLandfillManagement>
          </AdminRoute>
        ),
      },

      // STS Manager Route
      {
        path: "mysts",
        element: (
          <STSManagerRoute>
            <MySTS></MySTS>
          </STSManagerRoute>
        ),
      },
      {
        path: "sts-vehicle-entry",
        element: (
          <STSManagerRoute>
            <STSVehicleEntry></STSVehicleEntry>
          </STSManagerRoute>
        ),
      },
      {
        path: "fleet-of-truck",
        element: (
          <STSManagerRoute>
            <FleetOfTruck></FleetOfTruck>
          </STSManagerRoute>
        ),
      },
      {
        path: "route-view",
        element: (
          <STSManagerRoute>
            <RouteView></RouteView>
          </STSManagerRoute>
        ),
      },
      // Landfill Manager Route
      {
        path: "mylandfill",
        element: (
          <LandfillManagerRoute>
            <MyLandfill></MyLandfill>
          </LandfillManagerRoute>
        ),
      },
      {
        path: "landfill-vehicle-entry",
        element: (
          <LandfillManagerRoute>
            <LandfillVehicleEntry></LandfillVehicleEntry>
          </LandfillManagerRoute>
        ),
      },
      {
        path: "billing-report",
        element: (
          <LandfillManagerRoute>
            <BillingReport></BillingReport>
          </LandfillManagerRoute>
        ),
      },
    ],
  },
]);
export default router;
