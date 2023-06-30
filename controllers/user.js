const { UsersClass } = require("../services/user");
const userServices = new UsersClass();
const { uploadImg  } = require("../utils/awsS3Config");
const { sendEmail } = require("../utils/sendEmail");
const { decryptPassword } = require("../utils/index");


const registerUsers = async (req, res) => {
  try {

    const { userName, contactNo, email, password } = JSON.parse(
      req.body.data
    );

    let file = req.files;

    let { status: userExist } = await userServices.verifyIfExist(
      {
        email_id: email,
        is_active: true,
      }
    );

    if (userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "User Already Exist",
      });
    }
    let url
    if(file.length>0){
      let s3Response = await uploadImg(file);
      const { Location } = s3Response[0]
      url=Location
    }
    const {
      message: { id: userId },
    } = await userServices.create({
      userName,
      contactNo,
      email,
      password,
      url,
    });

    const { message: { user_otp: otp } } = await userServices.createUserOtp(userId);
    await sendEmail(email, { userName, otp })
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

const validateUserOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    let { status: userExist } = await userServices.verifyIfExist({
      email_id: email,
      is_active: true,
      is_otp_verified: false,
    });

    if (!userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "Invalid Email",
      });
    }

    const { message: { users_otp_validate: { user_otp } } } = await userServices.findUserOtp(email);
    let response = {
      message: "Invalid OTP"
    }
    if (otp === user_otp) {
      await userServices.updateUserOtpStatus(email);
      response.message = "User OTP Verified Successfully"
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

const updateUserProfile = async (req, res) => {
  try {

    const { userId, userName, contactNo, email } = JSON.parse(
      req.body.data
    );
    let file = req.files;

    let { status: userExist } = await userServices.verifyIfExist({
      email_id: email,
      is_active: true,
    });

    if (!userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "No user Found",
      });
    }
    let url
    if(file.length>0){
      let s3Response = await uploadImg(file);
      const { Location } = s3Response[0]
      url=Location
    }
   

    const {
      message
    } = await userServices.update({
       userName, contactNo, email, url
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


    let { status: userExist } = await userServices.verifyIfExist({
      email_id: email,
      is_active: true,
    });

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


    let { status: userExist } = await userServices.verifyIfExist({
      email_id: email,
      is_active: true,
    });

    if (!userExist) {
      return res.status(409).json({
        status: "FAILURE",
        statusCode: 409,
        message: "No user Found",
      });
    }

    const {
      message: { id, user_name, email_id, contact_no, profile_pic, password: encPassword }
    } = await userServices.findOne(
      email,
    );

    const isPasswordMatched = decryptPassword(password, encPassword)

    let response = {}

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
    const { email, newPassword } = req.body


    let { status: userExist } = await userServices.verifyIfExist({
      email_id: email,
      is_active: true,
    });

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
      { email, password: newPassword }
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
  resetUserPassword,
  validateUserOtp
};
