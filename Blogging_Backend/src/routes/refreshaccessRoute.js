const express=require("express")
const router=express.Router();
const {refreshaccessTokenController }=require("../controllers/refreshaccessTokenController")
router.post("/",refreshaccessTokenController)
module.exports = router;