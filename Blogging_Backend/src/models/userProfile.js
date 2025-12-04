const mongoose=require("mongoose")
const Default_User="..//assets/Default_User.jpg";
const userProfileschema=new mongoose.Schema({
 userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    
  },
  fullName: {type: String},
  bio: { type: String },
  profilePic: { type: String ,
    default:`${Default_User}`
  },
  accountType:{type:String,
     enum:["public","private"],
    default:'public'}
})
const UserProfile=mongoose.model("UserProfile",userProfileschema)
module.exports=UserProfile;