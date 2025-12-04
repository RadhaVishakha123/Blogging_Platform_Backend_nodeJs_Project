const Post=require("..//models/post");
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
module.exports={handleAddPost}

