const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpTimestamp = Date.now();
  return { otp, otpTimestamp };
};

module.exports = generateOTP;
