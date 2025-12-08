const PostLikes = require("..//models/postLikes");
async function toggleLike(req, res) {
  try {
    const { postId, userId } = req.body;
    if (!postId || !userId) {
      return res.status(404).json({ message: "postId & userId required" });
    }
    const exit = await PostLikes.findOne({ postId, userId });
    if (exit) {
      await PostLikes.deleteOne({ _id: exit._id });
      return res.status(200).json({ message: "Success", liked: false });
    }
    await PostLikes.create({ postId, userId });
    return res.status(200).json({ message: "Success", liked: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
async function postLikeCount(req, res) {
  try {
    const postId = req.query.postId;
    if (!postId ) {
      return res.status(400).json({ message: "postId  required" });
    }
    const count =await PostLikes.countDocuments({ postId });
    return res.status(200).json({count});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
async function isPostLike(req, res) {
  try {
    const { postId, userId } = req.query;
    if (!postId || !userId) {
     return res.status(400).json({ message: "postId & userId required" });
    }
    const like =await PostLikes.findOne({ postId, userId });
    return res.status(200).json({liked:!!like})
  } catch (err) {
    console.error(err);
   return res.status(500).json({ message: "Server error" });
  }
}
module.exports = { toggleLike, postLikeCount, isPostLike };
