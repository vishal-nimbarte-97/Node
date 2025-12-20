const userService = require("../services/user.service");
const sendApiResponse = require("../utils/apiResponse");
const HTTP_STATUS = require("../utils/httpStatus");

exports.createUser = async (req, res) => {
    try {
        /* ===============================
           1. Input validation & sanitization
           =============================== */
        let { username, password, role } = req.body || {};

        if (
            typeof username !== "string" ||
            typeof password !== "string"
        ) {
            return sendApiResponse(
                res,
                HTTP_STATUS.BAD_REQUEST,
                "Invalid request payload"
            );
        }

        username = username.trim();
        password = password.trim();

        role = typeof role === "string" ? role.trim() : "USER";

        if (!username || !password) {
            return sendApiResponse(
                res,
                HTTP_STATUS.BAD_REQUEST,
                "Username and password are required"
            );
        }

        /* ===============================
           2. Delegate business logic
           =============================== */
        const user = await userService.createUser({
            username,
            password,
            role
        });

        /* ===============================
           3. Success response
           =============================== */
        return sendApiResponse(
            res,
            HTTP_STATUS.CREATED,
            "User created successfully",
            user
        );

    } catch (error) {
        /* ===============================
           4. Secure error handling
           =============================== */
        const message =
            error?.name === "UserError"
                ? error.message
                : "Unable to create user";

        const status =
            error?.code === "USERNAME_EXISTS"
                ? HTTP_STATUS.CONFLICT
                : HTTP_STATUS.INTERNAL_SERVER_ERROR;

        return sendApiResponse(res, status, message);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        /* ===============================
           1. Delegate business logic
           =============================== */
        const users = await userService.getAllUsers();

        /* ===============================
           2. Handle null / empty response
           =============================== */
        if (!users || users.length === 0) {
            return sendApiResponse(
                res,
                HTTP_STATUS.OK,
                "No users found",
                []
            );
        }

        /* ===============================
           3. Success response
           =============================== */
        return sendApiResponse(
            res,
            HTTP_STATUS.OK,
            "Users fetched successfully",
            users
        );

    } catch (error) {
        /* ===============================
           4. Secure error handling
           =============================== */
        return sendApiResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            "Unable to fetch users"
        );
    }
};
