import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  axios.defaults.withCredentials = true;
  const [user, setUser] = useState(null);

  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/auth/loginstatus").then((response) => {
      console.log(response);
      if (response.data.loggedIn == true) {
        setUser(response.data?.user);
      }
    });
  }, [refetch]);
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
    axios.post("http://localhost:3000/auth/login", user).then((response) => {
      if (!response.data?.success) {
        // alert(response.data?.message);
        Swal.fire({
          icon: "error",
          title: response.data?.message,
          text: "Please try again.",
        });
      } else {
        console.log(response);
        localStorage.setItem("token", response.data?.token);
        // alert(response.data?.message);
        Swal.fire({
          icon: "success",
          title: response.data?.message,
          text: "Welcome back!",
        });
        setRefetch(!refetch);
      }
    });
  };

  const providerLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((response) => {
        if (!response.data?.success) {
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
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.removeItem("token");
              window.location.href = "/";
            }
          });
        }
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const authInfo = {
    user,
    providerLogin,
    providerRegister,
    providerLogout,
    refetch,
    setRefetch,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
