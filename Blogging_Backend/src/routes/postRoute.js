const express=require("express")
const router=express.Router();
const {handleAddPost,fetchAllPostwithUserProfileData,fetchUserAllPost }=require("../controllers/postController")
const uploadPostImage=require("..//middlewares/uploadPostImageMiddleware")
router.post("/",uploadPostImage.single("postImage"),handleAddPost)
router.get("/allpost",fetchAllPostwithUserProfileData);
router.get("/profilepost",fetchUserAllPost);
module.exports = router;





