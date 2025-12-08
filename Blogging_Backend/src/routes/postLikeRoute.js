const express=require("express")
const router=express.Router();
const {toggleLike,postLikeCount,isPostLike }=require("../controllers/postLikeController")
router.post("/toggle",toggleLike);
router.get("/count",postLikeCount);
router.get("/isliked",isPostLike);
module.exports = router;