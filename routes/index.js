const express = require('express');
const router = express.Router();
const {registerUsers}= require("../controllers/user") 
const {upload}=require('../utils/index')

router.post("/register",upload.array('profilePic', 1),registerUsers);

module.exports = router;