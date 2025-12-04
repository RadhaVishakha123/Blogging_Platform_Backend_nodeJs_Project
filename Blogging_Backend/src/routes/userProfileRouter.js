const express=require("express")
const uploadImage=require("..//middlewares/uploadImageMiddleware")
const router=express.Router();
const { handleAddUserProfile,handlefetchUserProfile}=require("../controllers/userProfileController")
router.post("/add",uploadImage.single("profilePic"),handleAddUserProfile);
router.get("/fetch",handlefetchUserProfile);
module.exports = router;