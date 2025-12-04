const User=require("..//models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },process.env.SECRET,
    {expiresIn:"1h"});
}
function generateRefreshToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },process.env.SECRET,
        {expiresIn:"7d"}
    );
}
function varifyAccessToken(token) {
    try {
        if (!token || typeof token !== "string") return null;
        const decoded = jwt.verify(token,process.env.SECRET);
       return decoded; // returns { id, email }
    } catch (err) {
        console.error("JWT ERROR:", err.message);
        return null;
    }
}
function varifyRefreshToken(token) {
    try {
        if (!token || typeof token !== "string") return null;
        const decoded = jwt.verify(token,process.env.SECRET);
       return decoded; // returns { id, email }
    } catch (err) {
        console.error("JWT ERROR:", err.message);
        return null;
    }
}

module.exports = {generateAccessToken,generateRefreshToken, varifyAccessToken,varifyRefreshToken};
