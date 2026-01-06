const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

/* ===============================
   Custom Auth Error
   =============================== */
class AuthError extends Error {
  constructor(message = "Invalid username or password", code = "AUTH_ERROR") {
    super(message);
    this.name = "AuthError";
    this.code = code; // added code for JSON response
  }
}

/* ===============================
   Login Service
   =============================== */
exports.login = async (username, password) => {
  // Normalize inputs (defense-in-depth)
  username = username.trim();

  /* ===============================
     1. Fetch user from DB
     =============================== */
  const query = `
    SELECT id, username, password, role
    FROM users
    WHERE username = $1
    LIMIT 1
  `;

  let user;
  try {
    const { rows } = await pool.query(query, [username]);
    if (rows.length === 0) {
      throw new AuthError("Invalid username", "INVALID_USERNAME");
    }
    user = rows[0];   
  } catch (err) {
    // Prevent DB error leaks
    if (err instanceof AuthError) throw err;
    throw new Error("Authentication failed");
  }

  /* ===============================
     3. Password verification
     =============================== */
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AuthError("Invalid password", "INVALID_PASSWORD");
  }

  /* ===============================
     4. Role authorization
     =============================== */
  if (user.role !== "ADMIN") {
    throw new AuthError("Access denied", "ACCESS_DENIED");
  }

  /* ===============================
     5. JWT creation
     =============================== */
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret not configured");
  }

  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  /* ===============================
     6. Return response
     =============================== */
  return {
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };
};
