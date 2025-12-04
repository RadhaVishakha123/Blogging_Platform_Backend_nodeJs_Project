const {varifyAccessToken}=require("..//service/auth")
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Access Denied: No Token" });

  try {
    const verifyUser = await varifyAccessToken(token)
    req.user = verifyUser;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
module.exports ={authMiddleware}
