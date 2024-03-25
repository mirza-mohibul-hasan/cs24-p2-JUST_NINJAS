import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { Link } from "react-router-dom";

const Login = () => {
  const { providerLogin } = useContext(AuthContext);
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    providerLogin(email, password);
  };
  return (
    <div className="container">
      <div className="auth-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            id="email"
            placeholder="Username"
            className="input-field"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="input-field"
          />
          <input type="submit" value="Login" className="submit-btn" />
        </form>
        <Link to="/resetpassword">
          <button>Reset Password</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
