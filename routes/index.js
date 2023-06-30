const express = require('express');
const router = express.Router();
const {registerUsers,updateUserProfile,deleteUserProfile,loginUserProfile,resetUserPassword}= require("../controllers/user") 
const {upload}=require('../utils/index')

router.post("/register",upload.array('profilePic', 1),registerUsers);

router.post("/update-user",upload.array('profilePic', 1),updateUserProfile);

router.delete("/delete-user",deleteUserProfile);

router.post("/login",loginUserProfile);

router.post("/forget-password",resetUserPassword);

module.exports = router;