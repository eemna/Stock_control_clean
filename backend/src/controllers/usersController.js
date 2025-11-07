import { sql } from "../config/db.js";

export async function createUser(req, res) {
  try {
    const { name, password, user_id, role } = req.body;

    // Validate required fields
    if (!name || !password || !user_id || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user_id already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE user_id = ${user_id}
    `;
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "A user with this ID already exists." });
    }

    // Insert new user
    const [user] = await sql`
      INSERT INTO users (user_id, name, password, role)
      VALUES (${user_id}, ${name}, ${password}, ${role})
      RETURNING *
    `;

    console.log("✅ User created:", user);
    res.status(201).json({
      message: "User successfully created.",
      user,
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function verifyUser(req, res) {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required." });
  }

  try {
    const [user] = await sql`
      SELECT * FROM users WHERE name = ${name} AND password = ${password}
    `;

    if (!user) {
      return res.status(401).json({ message: "Incorrect name or password." });
    }

    res.status(200).json({ message: "Login successful.", user });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getUserByUserId(req, res) {
  try {
    const { user_Id } = req.params;

    const users = await sql`
      SELECT * FROM users WHERE user_id = ${user_Id} ORDER BY created_at DESC
    `;

    res.status(200).json(users);
  } catch (error) {
    console.log("❌ Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await sql`
      SELECT * FROM users ORDER BY user_id DESC
    `;
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteUsers(req, res) {
  const { user_id } = req.params;

  try {
    await sql`
      DELETE FROM users WHERE user_id = ${user_id}
    `;
    res.json({ message: "✅ User deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function updateUsers(req, res) {
  const { user_id } = req.params;
  const { name, role, password } = req.body;

  try {
    await sql`
      UPDATE users
      SET name = ${name}, role = ${role}, password = ${password}
      WHERE user_id = ${user_id}
    `;

    res.json({ message: "✅ User updated successfully." });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
