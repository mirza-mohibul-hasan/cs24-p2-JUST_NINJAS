import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
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
  const handleRegister = async (event) => {
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
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.logemail.value;
    const password = event.target.logpassword.value;
    const user = { email, password };
    console.log(user);
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

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((response) => {
      console.log(response);
      localStorage.removeItem("token");
    });
  };
  // const userAuthenticeted = () => {
  //   axios
  //     .get("http://localhost:8000/isUserAuth", {
  //       headers: {
  //         "x-access-token": localStorage.getItem("token"),
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //     });
  // };
  // userAuthenticeted();
  return (
    <div className="container">
      <h1>
        Name: {user?.username} Role: {user?.role}
      </h1>
      <button onClick={handleLogout}>Log Out</button>
      <div className="auth-container">
        <h1>Register</h1>
        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="email"
            id="regemail"
            placeholder="Email"
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            id="regpassword"
            className="input-field"
          />
          <input type="submit" value="Register" className="submit-btn" />
        </form>
      </div>
      <div className="auth-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            id="logemail"
            placeholder="Username"
            className="input-field"
          />
          <input
            type="password"
            id="logpassword"
            placeholder="Password"
            className="input-field"
          />
          <input type="submit" value="Login" className="submit-btn" />
        </form>
      </div>
    </div>
  );
}

export default App;
