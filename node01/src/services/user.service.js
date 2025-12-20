const pool = require("../config/db");
const bcrypt = require("bcrypt");

/* ===============================
   Custom User Error
   =============================== */
class UserError extends Error {
    constructor(message, code = "USER_ERROR") {
        super(message);
        this.name = "UserError";
        this.code = code;
    }
}

/* ===============================
   Create User Service
   =============================== */
exports.createUser = async ({ username, password, role }) => {
    /* ===============================
       1. Check existing user
       =============================== */
    const checkQuery = `
        SELECT id
        FROM users
        WHERE username = $1
        LIMIT 1
    `;

    try {
        const { rows } = await pool.query(checkQuery, [username]);
        if (rows.length > 0) {
            throw new UserError(
                "Username already exists",
                "USERNAME_EXISTS"
            );
        }
    } catch (err) {
        if (err instanceof UserError) throw err;
        throw new Error("User validation failed");
    }

    /* ===============================
       2. Hash password
       =============================== */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ===============================
       3. Insert user
       =============================== */
    const insertQuery = `
        INSERT INTO users (username, password, role)
        VALUES ($1, $2, $3)
        RETURNING id, username, role, created_at
    `;

    let user;
    try {
        const { rows } = await pool.query(insertQuery, [
            username,
            hashedPassword,
            role
        ]);
        user = rows[0];
    } catch (err) {
        throw new Error("User creation failed");
    }

    /* ===============================
       4. Return safe response
       =============================== */
    return {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.created_at
    };
};


/* ===============================
   Get All Users Service
   =============================== */
exports.getAllUsers = async () => {
    const query = `
        SELECT 
            id,
            username,
            role,
            created_at,
            updated_at
        FROM users
        ORDER BY created_at ASC
    `;

    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        throw new Error("Failed to fetch users");
    }
};