const express = require("express");

const authRoutes = require("./routes/auth.routes");
const sendApiResponse = require("./utils/apiResponse");
const HTTP_STATUS = require("./utils/httpStatus");

const app = express();

// Middleware
app.use(express.json());

// Routes
// app.get("/api/test", (req, res) => {
//   const dummyData = {
//     id: 1,
//     name: "Test User",
//     role: "ADMIN"
//   };

//   return sendApiResponse(
//     res,
//     HTTP_STATUS.OK,
//     "Test API fetched successfully",
//     dummyData
//   );
// });

// Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
    return sendApiResponse(
        res,
        HTTP_STATUS.NOT_FOUND,
        "API endpoint not found"
    );
});

module.exports = app;
