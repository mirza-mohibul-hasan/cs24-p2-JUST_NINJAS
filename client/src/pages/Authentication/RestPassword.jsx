import axios from "axios";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
const RestPassword = () => {
  useTitle("Reset Password");
  const navigate = useNavigate();
  const handleReset = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    axios
      .post("http://localhost:3000/auth/reset-password/initiate", {
        email,
      })
      .then((response) => {
        // console.log(response);
        if (response.data?.success) {
          alert(response.data?.message);
          sessionStorage.setItem("resetEmail", email);
          navigate("/otpverification");
        } else {
          alert(response.data?.message);
        }
      });
  };
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="p-5 m-5 lg:w-1/5 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-3 my-2">
          Reset Password
        </h2>
        <form
          className="flex flex-col justify-between gap-3 bg-r min-h-[15vh]"
          onSubmit={handleReset}
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
            type="submit"
            value="Send OTP"
            className="bg-[#4765ebc3] text-white font-semibold rounded hover:bg-white hover:text-[#4765ebc3] hover:border hover:border-[#4765ebc3]"
          />
        </form>
      </div>
    </div>
  );
};

export default RestPassword;
