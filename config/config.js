module.exports = {
  DB_CONFIG: {
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    TIMEZONE: "+05:30",
    POOL: {
      MAX: 5,
      MIN: 1,
      IDLE: 30000,
    },
  },
  AWS_CONFIG:{
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      bucketName: process.env.BUCKET_NAME,
      bucketRegion: process.env.BUCKET_REGION
  }
};
