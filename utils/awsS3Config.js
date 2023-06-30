const multer = require("multer");
const { AWS_CONFIG } = require('../config/config')
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    credentials: {
      accessKeyId: AWS_CONFIG.accessKeyId,
      secretAccessKey: AWS_CONFIG.secretAccessKey
    },
    region: AWS_CONFIG.bucketRegion,
    httpOptions: {
      timeout: 10 * 60 * 1000  // 10min timeout
    },
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
  });
  
  AWS.config.update({
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
    region: AWS_CONFIG.bucketRegion
  });

  const multerMiddleware = (req, file, cb) => {
    // console.log(file);
    if (file.fieldname === "profilePic") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only png, jpg, jpeg files are allowed"), false);
      }
    } else {
      cb(new Error("Only png, jpg, jpeg files are allowed"), false);
    }
  };
  
  const upload = multer({
    limits: {
      fileSize: 1024 * 1024 * 1024 * 2, // 2GB
    },
    fileFilter: multerMiddleware,
  });
  
  const uploadImg = (files) => {
    return new Promise((resolve, reject) => {
      console.log("Selected files: " + files.length);
      if (files.length > 0) {
        const responseData = [];
        files.map((item) => {
          console.log(`Uploading: ${item.fieldname}`);
          const params = {
            Bucket: 'user-auth-profile-pics',//AWS_CONFIG.bucketName,
            Key: Date.now() + '@' + item.originalname,
            Body: item.buffer,
          }
          const options = {
            partSize: 10 * 1024 * 1024,
            queueSize: 10
          };
          s3.upload(params, options).on('httpUploadProgress', (evt) => {
            console.log('Completed ' + (evt.loaded * 100 / evt.total).toFixed() + '% of upload');
          }).send((error, successData) => {
            if (error) {
              responseData.push(error);
              if (responseData.length === Object.keys(files).length) {
                reject(responseData);
              }
            } else {
              responseData.push(successData);
              if (responseData.length === Object.keys(files).length) {
                resolve(responseData);
              }
            }
          });
        });
      } else {
        console.log("else part from core/s3upload got executed");
        let successData = {
          message: "Nothing to upload, since no documents where selected!"
        }
        resolve(successData);
      }
    });
  }

  module.exports={
    upload,
    uploadImg
  }