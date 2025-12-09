const express=require("express")
const router=express.Router();
const {handleUnFollow, handleFollow, checkIsFollowing,countFollowing,countFollower,fetchUserFollower,fetchUserFollowing }=require("../controllers/followController")
router.post("/unfollowuser",handleUnFollow)
router.post("/followuser",handleFollow)
router.get("/",checkIsFollowing)
router.get("/countFollowing",countFollowing)
router.get("/countFollower",countFollower)
router.get("/fetchUserFollower",fetchUserFollower)
router.get("/fetchUserFollowing",fetchUserFollowing)
module.exports = router;