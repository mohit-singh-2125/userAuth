const bcrypt = require("bcryptjs");


const createOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const encryptPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const decryptPassword = (password, encPassword) => {
 return bcrypt.compare(password, encPassword)
};


module.exports = {
  createOtp,
  encryptPassword,
  decryptPassword,
};
