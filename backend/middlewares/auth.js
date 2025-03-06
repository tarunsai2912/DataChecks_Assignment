const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["x-token"];

    if (!token) {
      return res.status(402).json({ msg: "Unauthorized access!" });
    }

    const verify = await jwt.verify(token, process.env.SECRET);
    if (verify) {
      req.body.userId = verify._id;
      next();
    } else {
      return res.status(403).json({ msg: "Unauthorized access!" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware };
