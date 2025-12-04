const RefreshToken=require("..//models/refreshToken")
const {varifyRefreshToken,generateAccessToken}=require("..//service/auth")
async function refreshaccessTokenController(req,res) {

  try {
    const token = req.cookies.refreshToken;
    //console.log("refreshToken. :  ",token)
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const user = varifyRefreshToken(token);

    // Check DB token exists
    const savedToken = await RefreshToken.findOne({ userId: user.id, token });
    if (!savedToken) return res.status(403).json({ message: "Invalid token" });

    // Create new access token
    const accessToken = generateAccessToken(user);

    return res.json({ accessToken,
      user });
  } catch (err) {
   console.log("REFRESH ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }

}
module.exports={refreshaccessTokenController}