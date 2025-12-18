const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

/* ===============================
   Custom Auth Error
   =============================== */
class AuthError extends Error {
  constructor(message = "Invalid username or password") {
    super(message);
    this.name = "AuthError";
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
    SELECT id, username, password, role, is_active
    FROM users
    WHERE username = $1
    LIMIT 1
  `;

  let user;
  try {
    const { rows } = await pool.query(query, [username]);
    if (rows.length === 0) {
      throw new AuthError();
    }
    user = rows[0];
  } catch (err) {
    // Prevent DB error leaks
    if (err instanceof AuthError) throw err;
    throw new Error("Authentication failed");
  }

  /* ===============================
     2. Account status check
     =============================== */
  if (user.is_active === false) {
    throw new AuthError("Account is disabled");
  }

  /* ===============================
     3. Password verification
     =============================== */
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AuthError();
  }

  /* ===============================
     4. Role authorization
     =============================== */
  if (user.role !== "ADMIN") {
    throw new AuthError("Access denied");
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
