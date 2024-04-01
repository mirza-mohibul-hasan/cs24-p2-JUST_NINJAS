import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link, NavLink } from "react-router-dom";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";
import logo from "../assets/logo.png";
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
              <span className="font-agbalumo text-2xl font-semibold dark:text-white">
                EcoSync DNCC
              </span>
            </Link>
            {/* primary */}
            <div className="hidden lg:flex gap-8 text-lg uppercase font-semibold">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : " rounded p-1 text-center text-xl"
                }
                to="/"
              >
                Home
              </NavLink>
              {user && (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                      : " rounded p-1 text-center text-xl"
                  }
                  to="/dashboard/home"
                >
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
                  <Link to="/login">
                    <button className="w-20 mx-auto rounded-lg border-solid border-2 hover:border-blue-600 hover:bg-white hover:text-blue-600 py-1 px-1 bg-blue-800 dark:bg-gray-800 text-white">
                      LOGIN
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:flex gap-2 font-poppins">
                  <button
                    onClick={providerLogout}
                    className="w-20 mx-auto rounded-lg border-solid border-2 hover:border-blue-600 hover:bg-white hover:text-blue-600 py-1 px-1 bg-blue-800 dark:bg-gray-800 text-white"
                  >
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
        className={`w-52 z-50 absolute overflow-hidden bg-[#4765ebc3] flex flex-col lg:hidden origin-top duration-700 rounded-br-xl ${
          !toggleMenu ? "h-0" : "h-fit mt-3 py-5"
        }`}
      >
        <div className="px-8">
          <div className="flex flex-col gap-6 text-sm tracking-wider">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                  : " rounded p-1 text-center text-xl"
              }
              to="/"
            >
              Home
            </NavLink>
            {user && (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#2145e6]  rounded p-1 text-center text-xl text-white"
                    : " rounded p-1 text-center text-xl"
                }
                to="/dashboard/home"
              >
                Dashbord
              </NavLink>
            )}
            {!user ? (
              <>
                <Link to="/login">
                  <button className="w-20 mx-auto rounded-lg border-solid border-2 hover:border-blue-600 hover:bg-white hover:text-blue-600 py-1 px-1 bg-blue-800 dark:bg-gray-800 text-white">
                    LOGIN
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button className="w-20 mx-auto rounded-lg border-solid border-2 hover:border-blue-600 hover:bg-white hover:text-blue-600 py-1 px-1 bg-blue-800 dark:bg-gray-800 text-white">
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
