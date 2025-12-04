const multer=require("multer")
const path=require("path");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"user_ProfilePic_uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const uploadImage=multer({storage:storage})
module.exports=uploadImage;