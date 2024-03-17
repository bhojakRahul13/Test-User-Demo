module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("user", {
    fullName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { isEmail: true },
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: Sequelize.STRING,
      defaultValue: false,
    },
    gender: {
      type: Sequelize.STRING,
      validate: {
        isIn: {
          args: [["male", "female","other"]],
          msg: "Must be male or female or other",
        },
      },
    },
    profilePic: {
      type: Sequelize.STRING,
    },
  });
  return Users;
};
