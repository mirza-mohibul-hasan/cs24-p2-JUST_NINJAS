import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  return (
    <div>
      <Navbar></Navbar>
      <div className=" dark:bg-gray-900 dark:text-white">
        <div className="lg:flex w-11/12 mx-auto gap-5 my-5 min-h-[75vh">
          <div className="lg:w-2/12 flex flex-col gap-2 lg:border-r-2 border-[#2145e6] pr-3 py-5">
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
                <NavLink
                  to="managelandfill"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  MANAGE LANDFILL
                </NavLink>
                <NavLink
                  to="create-role"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  CREATE ROLES
                </NavLink>
              </>
            )}
            {role == "stsmanager" && (
              <>
                <NavLink
                  to="mysts"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  MY STS
                </NavLink>
                <NavLink
                  to="sts-vehicle-entry"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  VEHICLE ENTRY
                </NavLink>

                <NavLink
                  to="fleet-of-truck"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  FLEET OF TRUCK
                </NavLink>
                <NavLink
                  to="route-view"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  ROUTE VIEW
                </NavLink>
              </>
            )}
            {role == "landmanager" && (
              <>
                <NavLink
                  to="mylandfill"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  MY LANDFILL
                </NavLink>
                <NavLink
                  to="landfill-vehicle-entry"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  ADD TRUCK ENTRY
                </NavLink>
                <NavLink
                  to="billing-report"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : "border border-[#2145e6] rounded p-1 text-center text-xl"
                  }
                >
                  BILLING REPORT
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
          <div className="w-full p-5">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;
