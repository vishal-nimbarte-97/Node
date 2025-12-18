const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// TEMP: Dummy user (replace with DB later)
const dummyUser = {
  id: 1,
  username: "admin",
  password: bcrypt.hashSync("admin@123", 10),
  role: "ADMIN"
};

exports.login = async (username, password) => {
  // 1. Check user
  if (username !== dummyUser.username) {
    throw new Error("Invalid username or password");
  }

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(
    password,
    dummyUser.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }

  // 3. Create token
  const token = jwt.sign(
    {
      userId: dummyUser.id,
      username: dummyUser.username,
      role: dummyUser.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  // 4. Return response
  return {
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: process.env.JWT_EXPIRES_IN,
    user: {
      id: dummyUser.id,
      username: dummyUser.username,
      role: dummyUser.role
    }
  };
};
