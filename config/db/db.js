require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    logging: false, //if you don't want log in terminal
    dialect: process.env.DIALECT,
    operatorsAliases: 0,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("error---", err);
  });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//  Model usage
db.users = require("../../schema/usersSchema")(sequelize, Sequelize);


/**
 * Assocation
 **/

// db.category.hasMany(db.product);
// db.product.belongsTo(db.category);

// db.cart.belongsTo(db.product);

// db.userAddress.hasMany(db.order, {
//   sourceKey: "id",
//   foreignKey: "userAddressId",
// });

// db.order.belongsTo(db.userAddress, {
//   sourceKey: "id",
//   foreignKey: "userAddressId",
// });

// db.orderDetail.belongsTo(db.order, {
//   sourceKey: "id",
//   foreignKey: "orderId",
// });

// db.order.hasMany(db.orderDetail, {
//   sourceKey: "id",
//   foreignKey: "orderId",
// });

// db.orderDetail.hasMany(db.product, {
//   sourceKey: "productId",
//   foreignKey: "id",
// });

// db.product.belongsTo(db.orderDetail, {
//   sourceKey: "productId",
//   foreignKey: "id",
//   //as: "Product"
// });

module.exports = db;
