module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("RBAC CHECK:", req.user.role, allowedRoles); // 👈 TEMP DEBUG

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission."
      });
    }

    next();
  };
};
