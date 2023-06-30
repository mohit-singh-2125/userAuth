const Sequelize = require("sequelize");

module.exports = (connection, DataType) => {
  const usersSchema = connection.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: {
        type: Sequelize.STRING,
      },
      contact_no: {
        type: Sequelize.BIGINT,
      },
      email_id: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      profile_pic:{
        type: Sequelize.STRING,
      },
      is_otp_verified: {
        type: Sequelize.BOOLEAN,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    },
    {
      classMethods: {},
      freezeTableName: true,
    }
  );
  usersSchema.associate = (models) => {
    // associations can be defined here
    usersSchema.hasOne(models.users_otp_validate, { foreignKey: 'user_id',sourceKey: 'id'  });
    usersSchema.hasMany(models.errors, { foreignKey: 'user_id',sourceKey: 'id'  });
};
  return usersSchema;
};
