const express=require("express")
const router=express.Router();
const {searchUser}=require("../controllers/searchController")
router.get("/",searchUser);
module.exports = router;