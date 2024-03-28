import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import useUserType from "../hooks/useUserType";
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
  }, [theme]);

  const [toggleMenu, setToggleMenu] = useState(false);
  const role = useUserType();
  console.log(role);

  return (
    // <div>
    //   <h1>Role: {user?.role}</h1>
    //   <button onClick={providerLogout}>Log Out</button>
    // </div>

    <div className="bg-[#4765ebc3] py-4 dark:text-gray-100 dark:bg-slate-900">
      <div className="w-full md:w-11/12 mx-auto">
        <div className="flex mx-auto justify-between w-full">
          {/* Primary menu and logo */}
          <div className="flex items-center gap-16">
            {/* logo */}
            <Link href="/" className="flex gap-1 text-gray-800 items-center ">
              <img src={logo} className="h-8 w-8 rounded-full" alt="" />
              <span className="font-agbalumo text-2xl font-semibold dark:text-white">
                EcoSync Ninja
              </span>
            </Link>
            {/* primary */}
            <div className="hidden lg:flex gap-8 text-lg">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/">temp1</NavLink>
              <NavLink to="/">temp2</NavLink>
              {user && <NavLink to="/dashboard/home">Dashbord</NavLink>}
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
                    <p className="h-6 w-6 ">Dark</p>
                  ) : (
                    <p className="h-6 w-6">Light</p>
                  )}
                </button>
                {user && <p>{user?.name}</p>}
              </div>
              {!user ? (
                <div className="hidden lg:flex gap-2 font-poppins">
                  <Link to="/login">
                    <button className="w-28 mx-auto rounded-lg border-solid border-2 border-[#E94339] py-1 px-4 hover:bg-[#E94339] hover:text-white text-gray-900 dark:border-white dark:hover:border-[#E94339] dark:text-white dark:bg-transparent dark:hover:text-[#E94339]">
                      LOGIN
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:flex gap-2 font-poppins">
                  <button
                    onClick={providerLogout}
                    className="w-20 mx-auto rounded-lg border-solid border-2 hover:border-[#E94339] hover:bg-white hover:text-gray-900 py-1 px-1 bg-[#E94339] dark:bg-gray-800 text-white"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
            {/* Mobile navigation toggle */}
            <div className="lg:hidden flex items-center pr-4">
              <button onClick={() => setToggleMenu(!toggleMenu)}>
                <p className="h-6">toggle</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* mobile navigation */}
      <div
        className={`w-52 z-50 absolute overflow-hidden bg-red-100 flex flex-col lg:hidden origin-top duration-700 rounded-br-xl ${
          !toggleMenu ? "h-0" : "h-fit mt-3 py-5"
        }`}
      >
        <div className="px-8">
          <div className="flex flex-col gap-6 text-sm tracking-wider">
            <NavLink to="/">Home</NavLink>
            <NavLink to="allrestaurants">Restaurants</NavLink>
            <NavLink to="allrestaurantsitems">All Items</NavLink>
            <NavLink to="offers">Offers</NavLink>
            <NavLink to="">My Dashboard</NavLink>
            {!user ? (
              <>
                <Link to="/login">
                  <button className="w-28 mx-auto rounded-lg border-solid border-2 border-[#E94339] py-1 px-4 hover:bg-[#E94339] hover:text-white">
                    LOGIN
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button className="w-20 mx-auto rounded-lg border-solid border-2 hover:border-[#E94339] hover:bg-white hover:text-gray-900 py-1 px-1 bg-[#E94339] text-white">
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
