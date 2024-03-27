import { createBrowserRouter } from "react-router-dom";
import DummyAuth from "../pages/DummyAuth/DummyAuth";
import Login from "../pages/Authentication/Login";
import MainLayout from "../layout/MainLayout";
import RestPassword from "../pages/Authentication/RestPassword";
import OTPVerification from "../pages/Authentication/OTPVerification";
import Home from "../pages/Home/Home";
import DashboardLayout from "../layout/DashboardLayout";
import AllUsers from "../pages/Dashboard/SytemAdmin/AllUsers/AllUsers";
import DashHome from "../pages/Dashboard/DashHome/DashHome";
import CreateUser from "../pages/Dashboard/SytemAdmin/CreateUser.jsx/CreateUser";
import Profile from "../pages/Dashboard/Profile/Profile";
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
      {
        path: "users",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "createuser",
        element: <CreateUser></CreateUser>,
      },
    ],
  },
]);
export default router;
