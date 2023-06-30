const { UsersClass } = require("../services/user");
const userServices = new UsersClass();
const { uploadImg, decryptPassword } = require("../utils/index");
const { sendEmail } = require("../utils/nodemailer");


const registerUsers = async (req, res) => {
  try {

    const { userName, contactNo, email, password } = JSON.parse(
      req.body.data
    );
    await sendEmail(email)
    let file = req.files;

    let { status: userExist } = await userServices.verifyIfExist(email);

    if (userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "User Already Exist",
      });
    }
    let s3Response = await uploadImg(file);
    const { Location: url } = s3Response[0]
    const {
      message: { id: userId },
    } = await userServices.create({
      userName,
      contactNo,
      email,
      password,
      url,
    });

    await userServices.createUserOtp(userId);

    return res.status(200).json({
      status: "SUCCESS",
      statusCode: 200,
      message: "User Created",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: err,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {

    const { userId, userName, contactNo, email } = JSON.parse(
      req.body.data
    );
    let file = req.files;

    let { status: userExist } = await userServices.verifyIfExist(email);

    if (!userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "No user Found",
      });
    }
    let s3Response = await uploadImg(file);
    const { Location: url } = s3Response[0]

    const {
      message
    } = await userServices.update({
      userId, userName, contactNo, email, url
    });


    return res.status(200).json({
      status: "SUCCESS",
      statusCode: 200,
      message: "User Updated",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: err,
    });
  }
};

const deleteUserProfile = async (req, res) => {
  try {

    const { userId, email } = req.query


    let { status: userExist } = await userServices.verifyIfExist(email);

    if (!userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "No user Found",
      });
    }
    const {
      message
    } = await userServices.delete({
      userId, email,
    });


    return res.status(200).json({
      status: "SUCCESS",
      statusCode: 200,
      message: "User Deleted",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: err,
    });
  }
};

const loginUserProfile = async (req, res) => {
  try {

    const { email, password } = req.body


    let { status: userExist } = await userServices.verifyIfExist(email);

    if (!userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "No user Found",
      });
    }

    const {
      message: { id, user_name,email_id, contact_no, profile_pic, password: encPassword }
    } = await userServices.findOne(
      email,
    );

    const isPasswordMatched = decryptPassword(password, encPassword)

    let response = { }

    if (isPasswordMatched) {
      response.message = 'Login Successful'
      response.userId = id
      response.userName = user_name
      response.emailId = email_id
      response.contactNo = contact_no
      response.profilePic = profile_pic
    }
    else {
      response.message = 'Wrong Password'
    }

    return res.status(200).json({
      status: "SUCCESS",
      statusCode: 200,
      message: { ...response },
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: err,
    });
  }
};
const resetUserPassword = async (req, res) => {
  try {
console.log("asddsasadsda",req.body)
    const { email, newPassword } = req.body


    let { status: userExist } = await userServices.verifyIfExist(email);

    if (!userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "No user Found",
      });
    }

    const {
      message
    } = await userServices.updatePassword(
     { email,password:newPassword}
    );

    return res.status(200).json({
      status: "SUCCESS",
      statusCode: 200,
      message: "Password Updated",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: err,
    });
  }
};


module.exports = {
  registerUsers,
  updateUserProfile,
  deleteUserProfile,
  loginUserProfile,
  resetUserPassword
};
