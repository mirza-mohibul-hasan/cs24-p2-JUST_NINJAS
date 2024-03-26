import { createBrowserRouter } from "react-router-dom";
import DummyAuth from "../pages/DummyAuth/DummyAuth";
import Login from "../pages/Authentication/Login";
import MainLayout from "../layout/MainLayout";
import RestPassword from "../pages/Authentication/RestPassword";
import OTPVerification from "../pages/Authentication/OTPVerification";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
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
]);
export default router;
