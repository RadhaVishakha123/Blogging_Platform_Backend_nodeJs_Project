const UserFollower = require("..//models/follower");
const UserFollowing = require("..//models/following");
async function handleUnFollow(req, res) {
  try {
    const { currentUserId, targetUserId } = req.body;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    const currentUserFollowing = await UserFollowing.findOneAndUpdate(
      { userId: currentUserId },
      { $pull: { following: targetUserId } } // add new comment
    );
    const targetUserFollower = await UserFollower.findOneAndUpdate(
      { userId: targetUserId },
      { $pull: { follower: currentUserId } } // add new comment
    );
    return res.status(200).json({
      message: "Unfollowed successfully",
      followed: false,
    });
  } catch (err) {
    console.log("Error", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
}
async function handleFollow(req, res) {
  try {
    const { currentUserId, targetUserId } = req.body;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    const currentUserFollowing = await UserFollowing.findOneAndUpdate(
      { userId: currentUserId },
      { $push: { following: targetUserId } }, // add new comment
      { upsert: true, new: true } // create doc if not exists
    );
    const targetUserFollower = await UserFollower.findOneAndUpdate(
      { userId: targetUserId },
      { $push: { follower: currentUserId } }, // add new comment
      { upsert: true, new: true } // create doc if not exists
    );
    return res.status(200).json({
      message: "followed successfully",
      followed: true,
    });
  } catch (err) {
    console.log("Error", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
}

async function checkIsFollowing(req, res) {
  try {
    const { currentUserId, targetUserId } = req.query;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    const currUserExist = await UserFollowing.findOne({
      userId: currentUserId,
    });
    if (!currUserExist) {
      return res.status(200).json({ isfollowing: false });
    }

    const isFollowing = currUserExist.following.includes(targetUserId);

    return res.status(200).json({ isfollowing: isFollowing });
  } catch (err) {
    console.log("Error ", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
}
async function countFollowingFollower(req, res) {
  try {
    const { profileUserId } = req.query;

    const userFollowing = await UserFollowing.findOne({
      userId: profileUserId,
    });
    const followingCount = userFollowing ? userFollowing.following.length : 0;
    const userFollower = await UserFollower.findOne({ userId: profileUserId });
    const followerCount = userFollower ? userFollower.follower.length : 0;
    return res.status(200).json({ followingCount, followerCount });
  } catch (err) {
    console.log("Error ", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
}

// async function countFollower(req, res) {
//   try {
//     const { profileUserId } = req.body;

//     const userFollower = await UserFollower.findOne({ userId: profileUserId });

//     const followerCount = userFollower ? userFollower.follower.length : 0;

//     return res.status(200).json({ followerCount });
//   } catch (err) {
//     console.log("Error ", err);
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: err.message });
//   }
// }

async function fetchUserFollower(req, res) {
  try {
    const { profileUserId } = req.query;

    const userFollower = await UserFollower.findOne({ userId: profileUserId });

    return res.status(200).json({ userFollower });
  } catch (err) {
    console.log("Error ", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
}

async function fetchUserFollowing(req, res) {
  try {
    const { profileUserId } = req.query;

    const userFollowing = await UserFollowing.findOne({
      userId: profileUserId,
    });

    return res.status(200).json({ userFollowing });
  } catch (err) {
    console.log("Error ", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
}

module.exports = {
  handleUnFollow,
  handleFollow,
  checkIsFollowing,
  countFollowingFollower,
  fetchUserFollower,
  fetchUserFollowing,
};
