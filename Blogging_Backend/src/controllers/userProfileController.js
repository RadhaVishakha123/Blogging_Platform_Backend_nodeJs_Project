const UserProfile=require("..//models/userProfile");
const path=require("path")
const fs = require("fs");
async function handleAddUserProfile(req,res) {
    try{const userId=req.body.userId;
      let imagePath = null;
    if (req.file) {
      imagePath = `/user_ProfilePic_uploads/${req.file.filename}`;
    }
if(!userId) return res.status(400).json({ message: "UserId required" });

let userProfile= await UserProfile.findOne({userId});
// If updating and old image exists → delete old image
    if (userProfile && req.file) {
      if (userProfile.profilePic) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          userProfile.profilePic
        );

        // Delete old file safely
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.log("Old image delete error:", err);
          } else {
            console.log("Old image removed:", oldImagePath);
          }
        });
      }
    }
const data={
    fullName: req.body.fullName,
    bio: req.body.bio,
    profilePic: imagePath,
    accountType: req.body.accountType
};
//update
if(userProfile){
    //Mongoose returns the updated document=>new:true , otherwise this returen the old data before the update
    userProfile=await UserProfile.findOneAndUpdate({userId},data,{new:true})
}
else{
    userProfile=await UserProfile.create({userId,...data});
}
return res.status(201).json({ message: "Success", profile: userProfile })}
 catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
    
}
async function handlefetchUserProfile(req,res) {
  try{  const userId=req.query.userId;
   if(!userId) return res.status(400).json({ message: "UserId required" });
   let userProfile=await UserProfile.findOne({userId});
   if (!userProfile) {
      // return empty default structure
      return res.status(200).json({
        profile: {
          userId,
          fullName: "",
          bio: "",
          profilePic: "",
          accountType: "public"
        }
      });
    }

    return res.status(200).json({ profile: userProfile });}

 catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

}

module.exports={handleAddUserProfile,handlefetchUserProfile}