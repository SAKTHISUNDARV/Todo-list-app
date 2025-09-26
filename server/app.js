const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const saltRounds = 10;

// --- CRITICAL: Fail fast if JWT_SECRET is not set ---
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is not defined.");
  process.exit(1);
}

const allowedOrigins = [
  "http://localhost:5173",                  
  "https://simple-todolist-app.vercel.app"
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Create a pool using the connection URL
const pool = mysql.createPool(process.env.DB_URL);

// ---------------- Improved Auth Middleware ----------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided. Please login again." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid token format. Please login again." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Session expired. Please login again." });
      }
      return res.status(403).json({ error: "Invalid token. Please login again." });
    }
    req.user = decoded;
    next();
  });
};

// ---------------- User Routes ----------------
app.post("/register", [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }),
  body('username').isLength({ min: 1 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const [userExists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (userExists.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [result] = await pool.query(sql, [username, email, hash]);
    
    res.status(201).json({ status: "success", userId: result.insertId });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      status: "success",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ---------------- Task Routes ----------------
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tododata WHERE user_id = ? ORDER BY created_at DESC", 
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/tasks", authMiddleware, [
  body('taskname').isLength({ min: 1 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskname } = req.body;
    const [result] = await pool.query(
      "INSERT INTO tododata (taskname, status, user_id) VALUES (?, ?, ?)",
      [taskname, 0, req.user.id]
    );

    res.status(201).json({ 
      id: result.insertId, 
      taskname, 
      status: 0,
      user_id: req.user.id 
    });
  } catch (err) {
    console.error("Add task error:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

app.put("/tasks/:id", authMiddleware, [
  body('taskname').isLength({ min: 1 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { taskname } = req.body;

    const [result] = await pool.query(
      "UPDATE tododata SET taskname = ? WHERE id = ? AND user_id = ?",
      [taskname, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ id, taskname });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.put("/tasks/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT status FROM tododata WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const newStatus = rows[0].status ? 0 : 1;
    await pool.query(
      "UPDATE tododata SET status = ? WHERE id = ? AND user_id = ?",
      [newStatus, id, req.user.id]
    );

    res.json({ id, status: newStatus });
  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(500).json({ error: "Failed to toggle task status" });
  }
});

app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM tododata WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", id });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.delete("/clearalltasks", authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM tododata WHERE user_id = ?",
      [req.user.id]
    );
    res.json({ 
      message: "All tasks cleared successfully!",
      deletedCount: result.affectedRows
    });
  } catch (err) {
    console.error("Error clearing tasks:", err);
    res.status(500).json({ error: "Failed to clear tasks" });
  }
});

// ---------------- Health Check Endpoint ----------------
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "OK", database: "Connected" });
  } catch (err) {
    res.status(500).json({ status: "Error", database: "Disconnected" });
  }
});

// ---------------- Error Handling ----------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});