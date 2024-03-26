import { useContext, useState } from "react";
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
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  return (
    <div className="flex justify-center items-center">
      <div className="p-5 m-5 md:w-1/5 rounded-xl shadow-2xl border border-[#2145e6]">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-3 my-2">
          LOGIN HERE
        </h2>
        <form
          className="flex flex-col gap-3 bg-r relative"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email"
            className="bg-gray-100 px-5 py-2 rounded"
          />

          <input
            type={passwordShown ? "text" : "password"}
            name="password"
            id="password"
            required
            placeholder="Password"
            className="bg-gray-100 px-5 py-2 rounded pr-10"
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer mt-3"
            onClick={togglePasswordVisiblity}
          >
            {passwordShown ? "Hide" : "Show"}
          </span>

          <input
            type="submit"
            value="Login"
            className="bg-[#2145e6db] text-white font-semibold rounded"
          />
        </form>
        <h4 className="my-3 text-sm text-gray-500 text-center">
          Forget Password?{" "}
          <Link to="/resetpassword" className="text-[#E94339]">
            Reset Here
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default Login;
