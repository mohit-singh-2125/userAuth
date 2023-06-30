const { UsersClass } = require("../services/user");
const userServices = new UsersClass();
const { uploadImg } = require("../utils/index");
const { sendEmail } = require("../utils/nodemailer");


const registerUsers = async (req, res) => {
  try {

    const { userName, contactNo, email, password, url } = JSON.parse(
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

    const {
      message: { id: userId },
    } = await userServices.create({
      userName,
      contactNo,
      email,
      password,
      url,
    });
    let s3Response = await uploadImg(file);
    console.log("S3", s3Response);
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

module.exports = {
  registerUsers,
};
