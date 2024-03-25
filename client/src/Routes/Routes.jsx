import { createBrowserRouter } from "react-router-dom";
import DummyAuth from "../pages/DummyAuth/DummyAuth";
import Login from "../pages/Authentication/Login";
import MainLayout from "../layout/MainLayout";
import RestPassword from "../pages/Authentication/RestPassword";
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
    ],
  },
]);
export default router;
