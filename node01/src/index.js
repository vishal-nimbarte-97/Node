// Environment file setup
require("dotenv").config({
  path: "../.env",
  quiet: true
});

// DB Connection (just importing initializes it)
require("./config/db");

const app = require("./app");

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server started on port http://localhost:${PORT}`);
});
