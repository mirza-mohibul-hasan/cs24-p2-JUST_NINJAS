import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  axios.defaults.withCredentials = true;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/profile")
      .then((response) => {
        if (response.data.loggedIn) {
          setUser(response.data?.user);
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch((error) => console.error("Error fetching login status:", error))
      .finally(() => setLoading(false));
  }, [refetch]);
  // console.log(user);
  const providerRegister = async (event) => {
    event.preventDefault();
    const email = event.target.regemail.value;
    const password = event.target.regpassword.value;
    const user = { email, password };
    await axios
      .post("http://localhost:3000/auth/create", user)
      .then((response) => {
        alert(response.data?.message);
      });
  };
  const providerLogin = async (email, password) => {
    const user = { email, password };
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        user
      );
      if (!response.data.success) {
        Swal.fire({
          icon: "error",
          title: response.data?.message,
          text: "Please try again.",
        });
      } else {
        localStorage.setItem("token", response.data.token);
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          text: "Welcome back!",
        });
        setRefetch(!refetch);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const providerLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/logout");
      if (!response.data.success) {
        Swal.fire({
          icon: "error",
          title: response.data?.message,
          text: "Please try again.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          text: "Thank you!",
        }).then(() => {
          localStorage.removeItem("token");
          setUser(null);
          window.location.href = "/";
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const authInfo = {
    user,
    loading,
    providerRegister,
    providerLogin,
    providerLogout,
    refetch,
    setRefetch,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
