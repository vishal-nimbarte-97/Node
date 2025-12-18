const authService = require("../services/auth.service");
const sendApiResponse = require("../utils/apiResponse");
const HTTP_STATUS = require("../utils/httpStatus");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return sendApiResponse(
                res,
                HTTP_STATUS.BAD_REQUEST,
                "Username and password are required"
            );
        }

        const result = await authService.login(username, password);

        return sendApiResponse(
            res,
            HTTP_STATUS.OK,
            "Login successful",
            result
        );
    } catch (error) {
        return sendApiResponse(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            error.message
        );
    }
};
