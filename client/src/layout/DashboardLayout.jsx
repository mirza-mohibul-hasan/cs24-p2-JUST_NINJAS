import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useUserType from "../hooks/useUserType";
const DashboardLayout = () => {
  const role = useUserType();
  return (
    <>
      <Navbar></Navbar>
      <div className="flex w-11/12 mx-auto gap-5 my-5 min-h-[75vh]">
        <div className="w-2/12 flex flex-col gap-2">
          <NavLink
            to="home"
            className={({ isActive }) =>
              isActive
                ? "bg-[#2145e6] border border-[#2145e6] rounded p-1 text-center text-xl text-white"
                : "border border-[#2145e6] rounded p-1 text-center text-xl"
            }
          >
            HOME
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                : "border border-[#2145e6] rounded p-1 text-center text-xl"
            }
          >
            PROFILE
          </NavLink>
          {role == "sysadmin" && (
            <>
              <NavLink
                to="users"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                USERS
              </NavLink>
              <NavLink
                to="createuser"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                CREATE USER
              </NavLink>
              <NavLink
                to="/vehicleregister"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                MANAGE USERS
              </NavLink>
            </>
          )}
        </div>
        <div className="w-full">
          <Outlet></Outlet>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default DashboardLayout;
