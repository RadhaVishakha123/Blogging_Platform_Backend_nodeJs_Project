require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB=require("./config/db");
const cookieParser=require("cookie-parser")
const refreshaccessRoutes=require("./routes/refreshaccessRoutes")
const authRoutes=require("./routes/authRoutes")

const app = express();

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
// routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/refresh",refreshaccessRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
