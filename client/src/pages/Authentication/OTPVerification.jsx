import axios from "axios";
const OTPVerification = () => {
  const handleVerify = async (event) => {
    event.preventDefault();
    const otp = parseInt(event.target?.otp?.value, 10);
    const newpasssword = event.target?.newpasssword?.value;
    const email = sessionStorage.getItem("resetEmail");
    axios
      .post("http://localhost:3000/auth/reset-password/confirm", {
        otp,
        newpasssword,
        email,
      })
      .then((response) => {
        if (response.data?.success) {
          alert(response.data?.message);
          sessionStorage.removeItem("resetEmail");
        } else {
          alert(response.data?.message);
        }
      });
  };
  return (
    <div className="container">
      <div className="auth-container">
        <h1>OTP Verify</h1>
        <form onSubmit={handleVerify} className="auth-form">
          <input
            type="number"
            id="otp"
            placeholder="OTP"
            className="input-field"
            required
          />
          <input
            type="password"
            id="newpasssword"
            placeholder="New Password"
            className="input-field"
            required
          />
          <input type="submit" value="Verify OTP" className="submit-btn" />
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
