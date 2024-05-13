import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContext } from "react";
import { LiaTruckSolid } from "react-icons/lia";
import { AuthContext } from "../provider/AuthProvider";
import { RiLandscapeFill } from "react-icons/ri";
import { FaTruckFront } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { GiIsland } from "react-icons/gi";
import {
  FaDumpster,
  FaHome,
  FaRegMoneyBillAlt,
  FaRoute,
  FaTruckMonster,
  FaUsersCog,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoIosAddCircle, IoMdCreate, IoMdPersonAdd } from "react-icons/io";
import { GoContainer } from "react-icons/go";
import { LuListStart } from "react-icons/lu";
import { MdAdminPanelSettings } from "react-icons/md";
const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  return (
    <div>
      <Navbar></Navbar>
      <div className=" dark:bg-gray-900 dark:text-white">
        <div className="lg:flex w-11/12 mx-auto gap-5 my-5 min-h-[75vh">
          <div className="lg:w-2/12 flex flex-col gap-2 lg:border-r-2 border-[#4765ebc3] pr-3 py-5">
            <NavLink
              to="home"
              className={({ isActive }) =>
                isActive
                  ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                  : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
              }
            >
              <FaHome />
              HOME
            </NavLink>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive
                  ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                  : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
              }
            >
              <CgProfile />
              PROFILE
            </NavLink>
            {role == "sysadmin" && (
              <>
                <NavLink
                  to="manageusers"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <FaUsersCog />
                  MANAGE USERS
                </NavLink>
                <NavLink
                  to="createuser"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoMdPersonAdd />
                  CREATE USER
                </NavLink>

                <NavLink
                  to="addvehicle"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <FaTruckMonster />
                  ADD VEHICLE
                </NavLink>
                <NavLink
                  to="creatests"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <GoContainer />
                  CREATE STS
                </NavLink>
                <NavLink
                  to="managests"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <LuListStart />
                  MANAGE STS
                </NavLink>
                <NavLink
                  to="createlandfill"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoMdCreate />
                  CREATE LANDFILL
                </NavLink>
                <NavLink
                  to="managelandfill"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <GiIsland />
                  MANAGE LANDFILL
                </NavLink>
                <NavLink
                  to="all-billing"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <FaRegMoneyBillAlt />
                  ALL BILLING
                </NavLink>
                <NavLink
                  to="create-role"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <MdAdminPanelSettings />
                  CREATE ROLES
                </NavLink>
                <NavLink
                  to="roles"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  ROLES
                </NavLink>
                <NavLink
                  to="register-third-party"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoIosAddCircle />
                  CREATE THIRDPARTY
                </NavLink>
                <NavLink
                  to="create-contractor-manager"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoIosAddCircle />
                  CREATE CONTRACTOR MANAGER
                </NavLink>
              </>
            )}
            {role == "stsmanager" && (
              <>
                <NavLink
                  to="mysts"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <FaDumpster />
                  MY STS
                </NavLink>
                <NavLink
                  to="sts-vehicle-exit"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoIosAddCircle />
                  VEHICLE EXIT
                </NavLink>
                <NavLink
                  to="sts-vehicle-entry"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoIosAddCircle />
                  VEHICLE ENTRY
                </NavLink>
                <NavLink
                  to="calculate-bills"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoIosAddCircle />
                  CALCULATE BILLS
                </NavLink>

                <NavLink
                  to="fleet-of-truck"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <LiaTruckSolid />
                  FLEET OF TRUCK
                </NavLink>
                <NavLink
                  to="route-view"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <FaRoute />
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
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md"
                  }
                >
                  <RiLandscapeFill />
                  MY LANDFILL
                </NavLink>
                <NavLink
                  to="landfill-vehicle-entry"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md"
                  }
                >
                  <FaTruckFront />
                  ADD TRUCK ENTRY
                </NavLink>
                <NavLink
                  to="billing-report"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md"
                  }
                >
                  <TbReport />
                  BILLING REPORT
                </NavLink>
              </>
            )}
            {role == "contractormanager" && (
              <>
                <NavLink
                  to="register-workforce"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoMdPersonAdd />
                  REGISTER WORKFORCE
                </NavLink>
              </>
            )}
            {role == "workforce" && (
              <>
                <NavLink
                  to="track-workforce"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#4765ebc3]  rounded p-1 text-left text-md text-white inline-flex items-center gap-1 pl-2"
                      : "border border-[#4765ebc3] rounded p-1 text-left text-md inline-flex items-center gap-1 pl-2 text-[#4765ebc3]"
                  }
                >
                  <IoMdPersonAdd />
                  TRACK WORKFORCE
                </NavLink>
              </>
            )}
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
