import axios from "axios";
import { createContext, useEffect, useState } from "react";

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
        alert(response.data?.message);
      } else {
        console.log(response);
        localStorage.setItem("token", response.data?.token);
        setRefetch(!refetch);
        alert(response.data?.message);
      }
    });
  };

  const providerLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((response) => {
      console.log(response);
      localStorage.removeItem("token");
    });
  };
  const authInfo = { user, providerLogin, providerRegister, providerLogout };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
