require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB=require("./config/db");
const cookieParser=require("cookie-parser")
const refreshaccessRoute=require("./routes/refreshaccessRoute")
const authRoute=require("./routes/authRoute")
const userProfileRoute=require("./routes/userProfileRoute");
const app = express();
const {authMiddleware}=require("./middlewares/authMiddleware")
const postRoute=require("./routes/postRoute")
const commentRoute=require("./routes/commentRoute")
const postLikeRoute=require("./routes/postLikeRoute")
// database connect
connectDB();

// middleware
app.use(cors({  origin: "http://localhost:5173", // your React frontend
    credentials: true,               // allow cookies / auth token
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
//cookie parse
app.use(cookieParser());
//Make the uploads folder public, and allow files inside it to be accessed through the URL /uploads/...
app.use('/user_ProfilePic_uploads',express.static("user_ProfilePic_uploads"))
app.use('/user_PostImage_uploads',express.static("user_PostImage_uploads"))
// routes
app.use("/api/auth", authRoute);
app.use("/api/auth/refresh",refreshaccessRoute);
app.use("/api/userprofile",authMiddleware,userProfileRoute);
app.use("/api/userpost",authMiddleware,postRoute);
app.use("/api/comment",authMiddleware,commentRoute);
app.use("/api/like",authMiddleware,postLikeRoute);
// server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
