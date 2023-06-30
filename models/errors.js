const Sequelize = require("sequelize");

module.exports = (connection, DataType) => {
  const errorsSchema = connection.define(
    "errors",
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
      error: {
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
  errorsSchema.associate = (models) => {
    // associations can be defined here
    errorsSchema.hasOne(models.users, { foreignKey: 'user_id',sourceKey: 'id'  });
};
  return errorsSchema;
};
