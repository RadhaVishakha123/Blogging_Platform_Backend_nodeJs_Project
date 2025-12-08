const UserProfile=require("..//models/userProfile");
const User=require("..//models/auth");
async function searchUser(req,res) {
try{const query = req.query.query;
    const userProfile=await UserProfile.find({});
const user=await User.find({});
const mergedUsers= user.map((user)=>{
    const profile= userProfile.find((p)=>p.userId.toString()==user._id.toString() )
    return{
    userId: user._id,
    username: user.username,
    fullName: profile?.fullName || "",
    profilePic: profile?.profilePic || "",
    bio: profile?.bio || "",
    accountType: profile?.accountType || "public",
    }
})
if(query){
    const filtered=mergedUsers.filter((u) =>
  u.username.toLowerCase().includes(query) ||
  u.fullName.toLowerCase().includes(query)
)
return res.status(200).json({ filtered });

}
 return res.status(200).json({  });
}
catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports={searchUser}