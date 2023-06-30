const Sequelize = require("sequelize");

module.exports = (connection, DataType) => {
  const payloadSchema = connection.define(
    "payload",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      logPoint: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      request: {
        type: Sequelize.STRING,
      },
      response: {
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
  return payloadSchema;
};
