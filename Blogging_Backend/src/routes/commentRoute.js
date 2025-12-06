const express=require("express")
const router=express.Router();
const { addPostComment,fetchPostComment}=require("../controllers/commentController")
router.post("/",addPostComment)
router.get("/",fetchPostComment)

module.exports = router;