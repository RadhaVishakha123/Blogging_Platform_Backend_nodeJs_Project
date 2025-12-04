const {getUserId}=require("..//service/auth")
module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Access Denied: No Token" });

  try {
    const verifyUser = getUserId(token)
    req.user = verifyUser;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
