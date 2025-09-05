const admin = require("../config/firebase");
const { User } = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const authUser = await User.findOne({ email: decodedToken.email });

      if (!authUser) {
        return res.status(401).send("User not found");
      }

      req.user = authUser;
      next();
    } catch (error) {
      console.error("Error verifying auth token:", error);
      res.status(401).send("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401).send("Not authorized, no token");
  }
};

module.exports = { protect };
