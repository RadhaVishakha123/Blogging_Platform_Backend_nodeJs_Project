const UserFollower = require("..//models/follower");
const UserFollowing = require("..//models/following");
async function handleUnFollow(req, res) {
     try {
    const { currentUserId, targetUserId } = req.body;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    const currentUserFollowing =await UserFollowing.findOneAndUpdate(
        { userId: currentUserId },
        { $pull: { following: targetUserId } },  // add new comment
      );
      const targetUserFollower =await UserFollower.findOneAndUpdate(
        { userId: targetUserId },
        { $pull: { follower: currentUserId } },  // add new comment
      );
      return res.status(200).json({
      message: "Unfollowed successfully",followed: false
    });
    
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }

}
async function handleFollow(req, res) {
    try {
    const { currentUserId, targetUserId } = req.body;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    const currentUserFollowing =await UserFollowing.findOneAndUpdate(
        { userId: currentUserId },
        { $push: { following: targetUserId } },  // add new comment
      { upsert: true, new: true }  // create doc if not exists
      );
      const targetUserFollower =await UserFollower.findOneAndUpdate(
        { userId: targetUserId },
        { $push: { follower: currentUserId } },  // add new comment
      { upsert: true, new: true }  // create doc if not exists
      );
      return res.status(200).json({
     message: "followed successfully",followed: true
    });
    
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

async function checkIsFollowing(req, res) {
  try {
    const { currentUserId, targetUserId } = req.query;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    const currUserExist =await UserFollowing.findOne({ userId: currentUserId });
    if (currUserExist) {
      const targetUserExist = currUserExist.following.includes(targetUserId);
      if (targetUserExist) {
        res.status(200).json({ isfollowing: true });
      }
      else{
        res.status(200).json({ isfollowing: false });
      }
    }
    res.status(200).json({ isfollowing: false });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

module.exports = { handleUnFollow, handleFollow, checkIsFollowing };
