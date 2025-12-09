const express=require("express")
const router=express.Router();
const {handleUnFollow, handleFollow, checkIsFollowing,countFollowingFollower,fetchUserFollower,fetchUserFollowing }=require("../controllers/followController")
router.post("/unfollowuser",handleUnFollow)
router.post("/followuser",handleFollow)
router.get("/",checkIsFollowing)
router.get("/count",countFollowingFollower)
router.get("/fetchUserFollower",fetchUserFollower)
router.get("/fetchUserFollowing",fetchUserFollowing)
module.exports = router;