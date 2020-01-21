const jwt = require("jsonwebtoken");
const Utils = require('../utils');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PASS);
    req.userData = decodedToken;
    next();
  } catch (error) {
    res.status(401).json(Utils.getErrorResponse("[Auth controller] User authentication failed.", error));
  }
};
