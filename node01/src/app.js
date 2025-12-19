const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const sendApiResponse = require("./utils/apiResponse");
const HTTP_STATUS = require("./utils/httpStatus");

const app = express();

/* ===============================
   CORS CONFIGURATION
================================ */
const corsOptions = {
  origin: [
    "http://localhost:4200",
    "http://127.0.0.1:4200"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors(corsOptions));
app.use(express.json());

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);

/* ===============================
   404 HANDLER
================================ */
app.use((req, res) => {
  return sendApiResponse(
    res,
    HTTP_STATUS.NOT_FOUND,
    "API endpoint not found"
  );
});

module.exports = app;
