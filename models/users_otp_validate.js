const Sequelize = require("sequelize");

module.exports = (connection, DataType) => {
  const usersOtpValidateSchema = connection.define(
    "users_otp_validate",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      user_otp: {
        type: Sequelize.STRING,
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

  usersOtpValidateSchema.associate = (models) => {
    // associations can be defined here
    usersOtpValidateSchema.belongsTo(models.users, {
      foreignKey: "user_id",
      sourceKey: "id",
    });
  };

  return usersOtpValidateSchema;
};
