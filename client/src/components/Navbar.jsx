import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link, NavLink } from "react-router-dom";
import { CiLight, CiLogin } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";
import logo from "../assets/logo.png";
import { IoHomeOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { SlLogout } from "react-icons/sl";
const Navbar = () => {
  const { user, providerLogout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme, user]);
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <div className="bg-[#4765ebc3] py-4 dark:text-gray-100 dark:bg-slate-900">
      <div className="w-full md:w-11/12 mx-auto">
        <div className="flex mx-auto justify-between w-full">
          {/* Primary menu and logo */}
          <div className="flex items-center gap-16">
            {/* logo */}
            <Link href="/" className="flex gap-1 text-gray-800 items-center ">
              <img src={logo} className="h-8 w-8 rounded-full" alt="" />
              <span className=" text-2xl font-semibold text-white">
                EcoSync DNCC
              </span>
            </Link>
            {/* primary */}
            <div className="hidden lg:flex gap-8 text-md uppercase font-semibold text-white">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "border  rounded p-1 text-center text-md text-white hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                    : " rounded p-1 text-center text-md hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                }
                to="/"
              >
                <IoHomeOutline />
                Home
              </NavLink>
              {user && (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "border  rounded p-1 text-center text-md text-white hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                      : " rounded p-1 text-center text-md hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                  }
                  to="/dashboard/home"
                >
                  <RxDashboard />
                  Dashboard
                </NavLink>
              )}
            </div>
          </div>
          {/* secondary */}
          <div className="flex gap-6 items-center">
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
                    <MdDarkMode className="h-5 w-5" />
                  ) : (
                    <CiLight className="h-5 w-5" />
                  )}
                </button>
                {user && <p className="text-white font-bold">{user?.name}</p>}
              </div>
              {!user ? (
                <div className="hidden lg:flex gap-2 font-poppins">
                  <Link to="/login" className="">
                    <button className="w-20 mx-auto rounded border-solid border hover:bg-white hover:text-[#4765ebc3] py-1 px-1  dark:bg-gray-800 text-white inline-flex items-center gap-1">
                      <CiLogin />
                      LOGIN
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:flex gap-2 font-poppins">
                  <button
                    onClick={providerLogout}
                    className="mx-auto border-solid border  rounded p-1 text-center text-md py-1 px- dark:bg-gray-800 text-white hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                  >
                    <SlLogout />
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
            {/* Mobile navigation toggle */}
            <div className="lg:hidden flex items-center pr-4">
              <button onClick={() => setToggleMenu(!toggleMenu)}>
                {toggleMenu ? (
                  <IoIosCloseCircle className="h-6 w-6" />
                ) : (
                  <GiHamburgerMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* mobile navigation */}
      <div
        className={`w-1/2 z-50 absolute overflow-hidden bg-[#4765ebc3] flex flex-col lg:hidden origin-top duration-700 rounded-br-xl ${
          !toggleMenu ? "h-0" : "h-fit mt-4 py-5"
        }`}
      >
        <div className="px-8">
          <div className="flex flex-col gap-6 text-sm tracking-wider">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "border  rounded p-1 text-center text-md text-white hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                  : " rounded p-1 text-center text-md hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
              }
              to="/"
            >
              <IoHomeOutline />
              Home
            </NavLink>
            {user && (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "border  rounded p-1 text-center text-md text-white hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                    : " rounded p-1 text-center text-md hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1 text-white border"
                }
                to="/dashboard/home"
              >
                <RxDashboard />
                Dashboard
              </NavLink>
            )}
            {!user ? (
              <>
                <Link to="/login" className="">
                  <button className="w-full mx-auto rounded border-solid border hover:bg-white hover:text-[#4765ebc3] py-1 px-1  dark:bg-gray-800 text-white inline-flex items-center gap-1">
                    <CiLogin />
                    LOGIN
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={providerLogout}
                  className="w-full mx-auto border-solid border  rounded p-1 text-center text-md py-1 px- dark:bg-gray-800 text-white hover:bg-white hover:text-[#4765ebc3] inline-flex items-center gap-1"
                >
                  <SlLogout />
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
