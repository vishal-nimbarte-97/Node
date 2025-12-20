const jwt = require("jsonwebtoken");
const sendApiResponse = require("../utils/apiResponse");
const HTTP_STATUS = require("../utils/httpStatus");

const authMiddleware = (req, res, next) => {
  try {
    /* ===============================
       1. Get token from header
       =============================== */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendApiResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Authorization token missing"
      );
    }

    /* ===============================
       2. Extract and verify token
       =============================== */
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ===============================
       3. Attach user info to request
       =============================== */
    req.user = decoded;

    /* ===============================
       4. Move to next middleware / controller
       =============================== */
    next();
  } catch (error) {
    return sendApiResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid or expired token"
    );
  }
};

module.exports = authMiddleware;