const { verifyAccessToken } = require("../query/query");

module.exports = async function (req, res, next) {
  try {
    const accessToken = req.header("Authorization");
    
    // Check if token is provided
    if (!accessToken) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

      // Verify the access token
    const userData =  verifyAccessToken(accessToken);

      // If userData is null, token is invalid
      if (!userData) {
        return res.status(401).json({ message: "Invalid token, authorization denied" });
      }

   // Check if the user associated with the token still exists in the database
    // const userExists = await query.checkUserExists(userData.userId);

    // If user doesn't exist, invalidate the token
    // if (!userExists) {
    //   return res.status(401).json({ message: "User associated with the token does not exist, authorization denied" });
    // }

    req.user = userData;
    next();
  } catch (err) {
    console.error("Error in authentication middleware:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
