const Comment=require("..//models/comment");
async function addPostComment(req,res) {
    try{const {postId,userId,comment}=req.body;
    if (!postId || !userId || !comment) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const commentObj = {
      postId,
      comment,
      createdAt: new Date()
    };
    //upsert: true=> If user has no comment document → create a new one automatically.
    const updatedData = await Comment.findOneAndUpdate(
      { userId: userId },          // find by user
      { $push: { comments: commentObj } },  // add new comment
      { upsert: true, new: true }  // create doc if not exists
    );

    return res.status(200).json({
      message: "Comment added successfully",
      data: updatedData
    });
}
   catch (err) {
    console.error("Add comment error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err
    });
  }

}
async function fetchPostComment(req,res) {
try {
    const postId = req.query.postId; // or req.params.postId if you use /:postId in route
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    // Fetch all comments for the post
   const comments = await Comment.find({
  "comments.postId": { $eq: postId }
});

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
module.exports={addPostComment,fetchPostComment}

