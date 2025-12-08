const Post=require("..//models/post");
const UserProfile=require("..//models/userProfile")
const Default_User="..//assets/Default_User.jpg";
async function handleAddPost(req,res) {
    try {
    const { userId, content } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/user_PostImage_uploads/${req.file.filename}`;

    const post = await Post.create({
      userId,
      content,
      postImage:imageUrl,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Success", post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
}
async function fetchAllPostwithUserProfileData(req,res) {
   try {
    // 1. All posts from DB
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    // 2. Extract all userIds
    const userIds = posts.map(post => post.userId);

    // 3. Fetch profiles for all userIds
    const profiles = await UserProfile.find({
      userId: { $in: userIds }
    }).lean();

    // 4. Merge post + userProfile
    const mergedPosts = posts.map(post => {
      const user = profiles.find(
        profile => profile.userId.toString() === post.userId.toString()
      );

      return {
        ...post,
        fullName: user?.fullName || "Unknown User",
        profilePic: user?.profilePic ||null,
        accountType: user?.accountType || "public",
      };
    });

    res.status(200).json({
      message: "Success",
      data: mergedPosts
    });

  } catch (err) {
    console.log("Error in getAllPosts", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}
async function fetchUserAllPost(req,res) {
  const currentUserId=req.query.userId;
  const userProfileData=await UserProfile.findOne({userId:{$eq:currentUserId}}).lean();
  const posts=await Post.find({userId:{$eq:currentUserId}}).lean()
  const postData=posts.map((post)=>{
    return{
      ...post,
      fullName: userProfileData?.fullName || "Unknown User",
      profilePic:userProfileData?.profilePic ||null,
      accountType: userProfileData?.accountType || "public",
    }
  })
  res.status(200).json({
    message: "Success",
    data:postData
  })

}
module.exports={handleAddPost,fetchAllPostwithUserProfileData,fetchUserAllPost}

