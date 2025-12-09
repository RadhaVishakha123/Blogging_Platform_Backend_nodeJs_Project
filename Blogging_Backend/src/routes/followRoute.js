const express=require("express")
const router=express.Router();
const {handleUnFollow,handleFollow,checkIsFollowing }=require("../controllers/followController")
router.post("/unfollowuser",handleUnFollow)
router.post("/followuser",handleFollow)
router.get("/",checkIsFollowing)
module.exports = router;