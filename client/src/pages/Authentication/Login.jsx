import { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import useTitle from "../../hooks/useTitle";

const Login = () => {
  useTitle("Login");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { providerLogin } = useContext(AuthContext);
  const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false);
  function handleCaptcha(value) {
    setIsCaptchaSuccess(!!value);
    // console.log("captcha value: ", value);
  }
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    providerLogin(email, password);
    navigate(from, { replace: true });
  };
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div
        className="p-5 m-5 lg:w-1/5 rounded-xl shadow-md bg-white"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(33, 69, 230, 0.1), 0 2px 4px -1px rgba(33, 69, 230, 0.06)",
        }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-3 my-2">
          LOGIN HERE
        </h2>
        <form
          className="flex flex-col gap-3 dark:text-black"
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
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="checkbox"
              name="checkbox"
              onClick={togglePasswordVisiblity}
            ></input>
            <p>{passwordShown ? "Hide" : "Show"} Password</p>
          </div>

          <div
            className="flex justify-center"
            style={{ maxWidth: "100%", overflowX: "hidden" }}
          >
            <ReCAPTCHA
              sitekey={"6LdT1KYpAAAAAPxwh2xoSLCR7VK1QDiODBgeux-w"}
              onChange={handleCaptcha}
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>

          <input
            disabled={!isCaptchaSuccessful}
            type="submit"
            value="Login"
            className="text-[#4765ebc3] border rounded p-1 font-semibold hover:bg-[#4765ebc3] hover:text-white border-[#4765ebc3] uppercase w-full"
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
