const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

/**
 * @JWT  generateTokens
 */

const generateTokens = async (payload) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: "1h",
  });

  return { accessToken };
};

/**
 * @JWT   verifyTokens
 */

const verifyAccessToken = (async = (token) => {
  return jwt.verify(token, accessTokenSecret);
});


/**
 * @Hassing Password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);

  const hash_password = bcrypt.hash(password, salt);
  return hash_password;
};

/**
 * @Hassing bcryptPassword
 */

const bcryptPassword = async (password, user) => {
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};




module.exports = {
  hashPassword,
  bcryptPassword,
  generateTokens,
  verifyAccessToken
};
