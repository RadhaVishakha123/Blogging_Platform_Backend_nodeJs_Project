const mongoose=require("mongoose")
const refreshTokenschema=new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
})
const RefreshToken=mongoose.model("RefreshToken",refreshTokenschema)
module.exports=RefreshToken;