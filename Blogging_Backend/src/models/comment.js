const mongoose = require("mongoose");

const commentSchema1 = new mongoose.Schema({
  
  postId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }

});

const commentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },
  comments: [commentSchema1],
});

 const Comment = mongoose.model("Comment", commentSchema);
 module.exports=Comment;
