const db = require("../config/db/db");
const User = db.users;
const Op = db.Sequelize.Op; //used for opearation ex:- like,count
const { query } = require("../query/index");
const fs = require("fs");
const { validationResult } = require("express-validator");
const {
  userObjectResponse,
  userWithoutTokenObjectResponse,
} = require("../middleware/responseObject");

module.exports.userSignUp = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }
    let { fullName, email, password, isAdmin, gender } = req.body;
    let userObject;
    let url = req.headers.host;
    let user;
    let hash_Password;

    const condition = { where: { email } };
    user = await query.findOne(User, condition);

    if (!user) {
      hash_Password = await query.hashPassword(password);
      userObject = {
        fullName,
        email,
        password: hash_Password,
        isAdmin,
        gender,
        profilePic: req.file && url + "/" + req.file.filename,
      };

      user = await User.create(userObject);

      const { accessToken } = await query.generateTokens({
        id: user.dataValues.id,
      });

      let singleUserObject = await userObjectResponse(user, accessToken);
      return res.status(200).json({
        success: true,
        message: "Signup successful.",
        data: singleUserObject,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "You are already registered with this email address.",
      });
    }
  } catch (e) {
    console.error("Error in userSignUp:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports.userSignIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;

    let user, matchUser;

    const condition = { where: { email } };
    user = await User.findOne(condition);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    matchUser = await query.bcryptPassword(password, user);
    if (!matchUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { accessToken } = await query.generateTokens({
      id: user.dataValues.id,
    });

    let singleUserObject = await userObjectResponse(user, accessToken);

    return res.status(200).json({
      success: true,
      message: "Login Success.",
      data: singleUserObject,
    });
  } catch (e) {
    console.error("Error in userSignIn:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports.listUserById = async (req, res) => {
  try {
    const urlParams = req.params;
    const id = urlParams.id || "";
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User Id is missing or invalid.",
      });
    }

    const userDetails = await User.findByPk(id);
    User.findByPk(id);
    // Assuming User is defined elsewhere
    if (userDetails) {
      const singleUserObject = await userWithoutTokenObjectResponse(
        userDetails
      );

      return res.status(200).json({
        success: true,
        message: "Success.",
        data: singleUserObject,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User details not found.",
      });
    }
  } catch (e) {
    console.error("Error in get by id:", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports.deleteUserById = async (req, res) => {
  try {
    // Extract id from request parameters
    const { id } = req.params;

    // Define query to find user by id
    const userListQuery = { where: { id: id } };

    let removeableImagePath;

    // Check if userId in request matches id in params
    if (req.userId != id) {
      return res.status(401).json({
        success: false,
        message: "The request requires valid user authentication",
      });
    }

    // Find user by primary key
    const foundUser = await User.findByPk(id);
    if (!foundUser) {
      // Return error if user not found
      return res.status(400).json({
        success: false,
        message: "User details not found.",
      });
    }

    // Remove profile picture from folder
    removeableImagePath = foundUser.dataValues.profilePic
      ? foundUser.dataValues.profilePic.split("/")[1]
      : null;
    if (removeableImagePath) {
      fs.unlink(`./public/uploads/${removeableImagePath}`, (err) => {
        if (err) {
          console.log("unlink failed", err);
        } else {
          console.log("file deleted");
        }
      });
    }

    // Delete user from database
    const deletedCount = await User.destroy(userListQuery);

    // Check if user was successfully deleted
    if (deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: "Success",
      });
    } else {
      // Return error if user deletion failed
      return res.status(400).json({
        success: false,
        message: "User details not found",
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in Delete by id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.detailUser = async (req, res) => {
  try {
    let usersList;
    let usersTotalList;
    let search;
    let SortingField;
    let SortingType;
    let condition;

    search = req.query.search && req.query.search;
    if (search) {
      condition = {
        [Op.or]: [
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    let sortKey = {}; //we get object here
    sortKey = req.query;

    for (const [key, value] of Object.entries(sortKey)) {
      SortingField = key;
      SortingType = value;
    }

    switch (SortingField) {
      case "fullName":
        SortingField;
        break;
      case "email":
        SortingField;
        break;

      default:
        SortingField = "";
        break;
    }

    switch (SortingType) {
      case "1":
        SortingType = "ASC";
        break;

      default:
        SortingType = "DESC";
        break;
    }

    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let offset = page ? page * limit : 0;

    let additionalParamters = {
      where: condition,
      limit: limit,
      offset: offset,
      order: [[SortingField ? SortingField : "updatedAt", SortingType]],
    };

    usersList = await User.findAll(additionalParamters);
    usersTotalList = await User.findAll();

    const userListArray = [];
    for (let i = 0; i < usersList.length; i++) {
      const userDetails = usersList[i];
      const singleUserObject = await userWithoutTokenObjectResponse(
        userDetails
      );
      userListArray.push(singleUserObject);
    }

    let totalPages = Math.ceil(usersTotalList.length / limit);
    let nextPageNo = parseInt(page) + 1;

    let paginationObject = {
      totalItems: usersTotalList.length,
      totalPages,
      limit,
      currentpageNo: parseInt(page),
      nextPageNo,
      currentPageSize: usersList.length,
    };

    if (usersList) {
      return res.status(200).json({
        success: true,
        message: "Success.",
        data: userListArray,
        paginationt: paginationObject,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User list not found",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: errors.array(),
      });
    };
    const id = req.params.id || "";

    var updateQuery = { where: { id: id } };
    let url = req.headers.host;

    let profilePic = req.file && url + "/" + req.file.filename;
    let datas = req.body;
    let removeableImagePath, hashPassword;

    if (datas.password) {
      let oldPassword = datas.oldPassword;
      var user = await User.findByPk(id);
      let matchUser = await query.bcryptPassword(oldPassword, user);

      if (!matchUser) {
        return res.status(400).json({
          success: false,
          message: "Old passwod not matching.",
        });
      } else {
        hashPassword = await query.hashPassword(datas.password);
        datas.password = hashPassword;
      }
    }

    let userListQuery = {};
    if (profilePic == undefined) {
      userListQuery = datas;
    } else {
      userListQuery = { ...datas, profilePic };
    }

    var findAllUsers = await User.findAll();
    var findEmailExist = findAllUsers.filter(
      (users) => users.email == datas.email
    );
    if (findEmailExist.length) {
      return res.status(400).json({
        success: false,
        message: "User Email Already Exist.",
      });
    }
    var findById = await User.findByPk(id);

    if (!findById) {
      var err = await query.error("err_107");
      return res.status(400).json({
        success: false,
        message: "User details not found.",
      });
    } else {
      removeableImagePath = findById.dataValues.profilePic.split("/")[1];

      if (removeableImagePath) {
        let resultHandler = (err) => {
          if (err) {
            console.log("unlink failed", err);
          } else {
            console.log("file deleted");
          }
        };
        if (fs.existsSync(`./public/uploads/${removeableImagePath}`)) {
          fs.unlinkSync(
            `./public/uploads/${removeableImagePath}`,
            resultHandler
          );
        }
      }
      const newUser = await User.update(userListQuery, updateQuery);
      if (newUser == 1) {
        let usersDetails = await User.findByPk(id);

        let singleUserObject = await userWithoutTokenObjectResponse(
          usersDetails
        );
        return res.status(200).json({
          success: true,
          message: "Success.",
          data: singleUserObject,
        });
      }
    }
  } catch (e) {
    console.log("e-----------------------", e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
};
