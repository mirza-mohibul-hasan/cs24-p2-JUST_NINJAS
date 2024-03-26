import axios from "axios";
import { useNavigate } from "react-router-dom";
const RestPassword = () => {
  const navigate = useNavigate();
  const handleReset = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    axios
      .post("http://localhost:3000/auth/reset-password/initiate", { email })
      .then((response) => {
        console.log(response);
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
    <div className="container">
      <div className="auth-container">
        <h1>Reset</h1>
        <form onSubmit={handleReset} className="auth-form">
          <input
            type="text"
            id="email"
            placeholder="Email"
            className="input-field"
          />
          <input type="submit" value="Send OTP" className="submit-btn" />
        </form>
      </div>
    </div>
  );
};

export default RestPassword;
