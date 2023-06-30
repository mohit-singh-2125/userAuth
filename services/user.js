const MODELS = require("../models/index");
const { createOtp, encryptPassword } = require("../utils/index");
const userSchemaModel = MODELS.users;
const userOtpValidateSchemaModel = MODELS.users_otp_validate;

class Users {

  async verifyIfExist(obj) {
    try {
      const res = await userSchemaModel.findOne({
        where: {
          ...obj

        },
      });
      if (res) {
        return {
          status: true,
        };
      }
      return {
        status: false,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async create(reqParams) {
    try {
      const { userName, contactNo, email, password, url } = reqParams;
      const res = await userSchemaModel.create({
        user_name: userName,
        contact_no: contactNo,
        email_id: email,
        password: encryptPassword(password),
        profile_pic: url,
        is_otp_verified: false,
        is_active: true,
      });
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async createUserOtp(userId) {
    try {
      const res = await userOtpValidateSchemaModel.create({
        user_id: userId,
        user_otp: createOtp(),
      });
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async findUserOtp(email) {
    try {
      const res = await userSchemaModel.findOne({
        include: [{
          model: userOtpValidateSchemaModel,
          required: true
        }],
        where: { email_id: email, }
      });
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async updateUserOtpStatus(email) {
    try {
      const res = await userSchemaModel.update(
        {
          is_otp_verified: true,
        },
        {
          where: {
            email_id: email,
          },
        }
      );
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async update(reqParams) {
    try {
      const { userId, userName, contactNo, email, url } = reqParams;
      const res = await userSchemaModel.update(
        {
          user_name: userName,
          contact_no: contactNo,
          profile_pic: url,
        },
        {
          where: {
            email_id: email,
          },
        }
      );
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async delete({ userId, email }) {
    try {
      const res = await userSchemaModel.update(
        {
          is_active: false,
        },
        {
          where: {
            id: userId,
            email_id: email,
          },
        }
      );
      console.log("SADsadd")
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async findOne(email) {
    try {
      const res = await userSchemaModel.findOne({
        where: {
          email_id: email,
        },
      });
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }

  async updatePassword(reqParams) {
    try {
      const { email, password } = reqParams;
      const res = await userSchemaModel.update(
        {
          password: encryptPassword(password),
        },
        {
          where: {
            email_id: email,
          },
        }
      );
      return {
        status: true,
        message: res,
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  }
}

module.exports = {
  UsersClass: Users,
};
