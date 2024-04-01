import axios from "axios";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useTitle from "../../hooks/useTitle";

const ChangePassword = () => {
  useTitle("Change Password");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false);
  function handleCaptcha(value) {
    setIsCaptchaSuccess(!!value);
    // console.log("captcha value: ", value);
  }
  const [expiryTime, setExpiryTime] = useState(300);
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiryTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (expiryTime <= 0) {
      navigate(from, { replace: true });
    }
  }, [expiryTime, from, navigate]);

  const onSubmit = async (data) => {
    try {
      if (data.newpassword !== confirmPassword) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Password not matched.",
          showConfirmButton: false,
          timer: 700,
        });
      } else {
        // console.log(data);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.put(
          "http://localhost:3000/auth/change-password",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data?.success) {
          Swal.fire({
            icon: "success",
            title: response.data?.message,
            text: "Congratulations",
          });
          reset();
        } else {
          Swal.fire({
            icon: "error",
            title: response.data?.message,
            text: "Try Agin Later",
          });
        }
        navigate("/dashboard/profile");
      }
    } catch (error) {
      console.error("Error creating user:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 700,
      });
    }
  };

  const handleConfim = (e) => {
    const confirmPassword = e?.target?.value;
    setConfirmPassword(confirmPassword);
  };

  const seconds = expiryTime % 60;
  const minutes = Math.floor(expiryTime / 60);

  return (
    <div className=" min-h-screen">
      <div className="hero-content w-full">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-[#dadff3]">
          <div className="card-body">
            <h1 className="text-3xl text-center font-bold text-[#2145e6]">
              Change Password
            </h1>
            <p className="text-[#2145e6] text-center border border-[#2145e6] rounded-lg font-semibold"></p>
            <div className="text-center text-red-500 text-xl font-semibold">
              Time remaining: {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Old Password</span>
                </label>
                <input
                  {...register("oldpassword")}
                  type="password"
                  required
                  placeholder="Old Password"
                  className="input input-bordered bg-gray-100"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  required
                  {...register("newpassword")}
                  placeholder="Your password"
                  className="input input-bordered bg-gray-100"
                />
                {errors.password?.type === "minLength" && (
                  <p className="text-red-600">
                    Password must be more than six characters
                  </p>
                )}
                {errors.password?.type === "pattern" && (
                  <p className="text-red-600">
                    Password must have one Uppercase and one special character.
                  </p>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  onChange={handleConfim}
                  type="password"
                  required
                  placeholder="Confirm Password"
                  className="input input-bordered bg-gray-100"
                />
              </div>
              <div
                className="flex justify-center mt-1"
                style={{ transform: "scale(0.95)", transformOrigin: "0 0" }}
              >
                <ReCAPTCHA
                  sitekey={"6LdT1KYpAAAAAPxwh2xoSLCR7VK1QDiODBgeux-w"}
                  onChange={handleCaptcha}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="form-control mt-6 ">
                <input
                  disabled={!isCaptchaSuccessful}
                  className="text-white btn bg-[#2145e6] border-[#2145e6]"
                  type="submit"
                  value="Change"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
