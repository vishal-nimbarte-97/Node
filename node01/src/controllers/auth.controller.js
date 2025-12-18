const authService = require("../services/auth.service");
const sendApiResponse = require("../utils/apiResponse");
const HTTP_STATUS = require("../utils/httpStatus");

exports.login = async (req, res) => {
    try {
        /* ===============================
           1. Input validation & sanitization
           =============================== */
        let { username, password } = req.body || {};

        if (typeof username !== "string" || typeof password !== "string") {
            return sendApiResponse(
                res,
                HTTP_STATUS.BAD_REQUEST,
                "Invalid request payload"
            );
        }

        username = username.trim();
        password = password.trim();

        if (!username || !password) {
            return sendApiResponse(
                res,
                HTTP_STATUS.BAD_REQUEST,
                "Username and password are required"
            );
        }

        /* ===============================
           2. Delegate authentication logic
           =============================== */
        const authResult = await authService.login(username, password);

        /* ===============================
           3. Success response
           =============================== */
        return sendApiResponse(
            res,
            HTTP_STATUS.OK,
            "Login successful",
            authResult
        );

    } catch (error) {
        /* ===============================
           4. Secure error handling
           =============================== */

        // Do NOT leak internal errors to client
        const message =
            error?.name === "AuthError"
                ? error.message
                : "Invalid username or password";

        return sendApiResponse(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            message
        );
    }
};
