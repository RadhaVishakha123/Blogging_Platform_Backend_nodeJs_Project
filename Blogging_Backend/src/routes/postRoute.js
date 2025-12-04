const express=require("express")
const router=express.Router();
const {handleAddPost }=require("../controllers/postController")
const uploadPostImage=require("..//middlewares/uploadPostImageMiddleware")
router.post("/",uploadPostImage.single("postImage"),handleAddPost)

module.exports = router;