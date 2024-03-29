import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useUserType from "../hooks/useUserType";
const DashboardLayout = () => {
  const role = useUserType();
  return (
    <>
      <Navbar></Navbar>
      <div className="lg:flex w-11/12 mx-auto gap-5 my-5 min-h-[75vh]">
        <div className="lg:w-2/12 flex flex-col gap-2 lg:border-r-2 border-[#2145e6] pr-3">
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
                to="manageusers"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                MANAGE USERS
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
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                CREATE ROLES
              </NavLink>
              <NavLink
                to="addvehicle"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                ADD VEHICLE
              </NavLink>
              <NavLink
                to="creatests"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                CREATE STS
              </NavLink>
              <NavLink
                to="managests"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                MANAGE STS
              </NavLink>
              <NavLink
                to="createlandfill"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : "border border-[#2145e6] rounded p-1 text-center text-xl"
                }
              >
                CREATE LANDFILL
              </NavLink>
            </>
          )}
          <NavLink
            to="roles"
            className={({ isActive }) =>
              isActive
                ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                : "border border-[#2145e6] rounded p-1 text-center text-xl"
            }
          >
            ROLES
          </NavLink>
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
