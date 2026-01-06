const orderService = require("../services/orders.service");
const sendApiResponse = require("../utils/apiResponse");
const HTTP_STATUS = require("../utils/httpStatus");

exports.getAllOrders = async (req, res) => {
    try {
        /* ===============================
           1. Delegate business logic
           =============================== */
        const orders = await orderService.getAllOrders();

        /* ===============================
           2. Handle null / empty response
           =============================== */
        if (!orders || orders.length === 0) {
            return sendApiResponse(
                res,
                HTTP_STATUS.OK,
                "No orders found",
                []
            );
        }

        /* ===============================
           3. Success response
           =============================== */
        return sendApiResponse(
            res,
            HTTP_STATUS.OK,
            "Orders fetched successfully",
            orders
        );

    } catch (error) {
        /* ===============================
           4. Secure error handling
           =============================== */
        return sendApiResponse(
            res,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            "Unable to fetch orders"
        );
    }
};