require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection
pool.getConnection()
  .then(conn => {
    console.log("Connected to MySQL as id " + conn.threadId);
    conn.release();
  })
  .catch(err => console.error("MySQL connection failed:", err));

// Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tododata ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// Add new task
app.post("/add", async (req, res) => {
  const { taskname } = req.body;
  if (!taskname) return res.status(400).json({ error: "Task name is required" });

  try {
    const [result] = await pool.query("INSERT INTO tododata (taskname) VALUES (?)", [taskname]);
    res.json({ message: "Task added", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// Delete task
app.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const [result] = await pool.query("DELETE FROM tododata WHERE id = ?", [id]);
    res.json({ message: "Task deleted", affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// Toggle task status
app.put("/updatestatus", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("UPDATE tododata SET status = NOT status WHERE id = ?", [id]);
    const [rows] = await pool.query("SELECT status FROM tododata WHERE id = ?", [id]);
    res.json({ message: "Status updated", status: rows[0].status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// Update task name
app.put("/update", async (req, res) => {
  const { id, taskname } = req.body;
  try {
    const [result] = await pool.query("UPDATE tododata SET taskname = ? WHERE id = ?", [taskname, id]);
    res.json({ message: "Task updated", affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
