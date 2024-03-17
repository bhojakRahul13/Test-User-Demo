const { query } = require("../query");

module.exports.userObjectResponse = async (user, accessToken = "") => {
  return {
    id: user.id ? (user.id) : "",
    fullName: user.fullName ? user.fullName : "",
    email: user.email ? user.email : "",
    gender: user.gender ? user.gender : "",
    profilePic: user.profilePic ? user.profilePic : "",
    created_at: user.createdAt ? user.createdAt : "",
    updated_at: user.updatedAt ? user.updatedAt : "",
    token: accessToken ? accessToken : "",
  };
};

module.exports.userWithoutTokenObjectResponse = async (user) => {
  return {
    id: user.id ? (user.id) : "",
    fullName: user.fullName ? user.fullName : "",
    email: user.email ? user.email : "",
    gender: user.gender ? user.gender : "",
    profilePic: user.profilePic ? user.profilePic : "",
    created_at: user.createdAt ? user.createdAt : "",
    updated_at: user.updatedAt ? user.updatedAt : "",
  };
};

