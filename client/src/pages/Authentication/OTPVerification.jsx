import axios from "axios";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
const OTPVerification = () => {
  useTitle("OTP Verification");
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false);
  function handleCaptcha(value) {
    setIsCaptchaSuccess(!!value);
  }
  const handleVerify = async (event) => {
    event.preventDefault();
    const otp = parseInt(event.target?.otp?.value, 10);
    const newpassword = event.target?.newpassword?.value;
    const email = sessionStorage.getItem("resetEmail");
    axios
      .post("http://localhost:3000/auth/reset-password/confirm", {
        otp,
        newpassword,
        email,
      })
      .then((response) => {
        if (response.data?.success) {
          alert(response.data?.message);
          navigate("/login");
          sessionStorage.removeItem("resetEmail");
        } else {
          alert(response.data?.message);
        }
      });
  };
  return (
    <div className="flex justify-center items-center">
      <div className="p-5 m-5 lg:w-1/5 rounded-xl shadow-2xl border">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-3 my-2">
          Confim Reset Password
        </h2>
        <form className="flex flex-col gap-3 bg-r" onSubmit={handleVerify}>
          <input
            type="number"
            name="otp"
            id="otp"
            required
            placeholder="OTP"
            className="bg-gray-100 px-5 py-2 rounded"
          />

          <input
            type={passwordShown ? "text" : "password"}
            name="newpassword"
            id="newpassword"
            required
            placeholder="New Password"
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
            value="Submit"
            className="text-[#4765ebc3] border rounded p-1 font-semibold hover:bg-[#4765ebc3] hover:text-white border-[#4765ebc3] uppercase w-full"
          />
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
