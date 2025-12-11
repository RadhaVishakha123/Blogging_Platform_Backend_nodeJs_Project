const express=require("express")
const router=express.Router();
const {handleAddPost,fetchAllPostwithUserProfileData,fetchUserAllPost,deletePost,updatePost}=require("../controllers/postController")
const uploadPostImage=require("..//middlewares/uploadPostImageMiddleware")
router.post("/",uploadPostImage.single("postImage"),handleAddPost)
router.get("/allpost",fetchAllPostwithUserProfileData);
router.get("/profilepost",fetchUserAllPost);
router.delete("/deletepost",deletePost)
router.patch("/updatepost",uploadPostImage.single("postImage"),updatePost)
module.exports = router;





