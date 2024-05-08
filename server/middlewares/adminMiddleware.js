const verifyAdmin = (req, res, next) => {
  const user = req.session?.user;
  if (!user) {
    return res.json({
      success: false,
      message: "User not authenticated",
    });
  }
  if (user?.role !== "sysadmin") {
    return res.json({
      success: false,
      message: "Access forbidden. Admin role required",
    });
  }
  next();
};

module.exports = verifyAdmin;
