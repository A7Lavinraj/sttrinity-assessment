const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Get all ideas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ideas ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
});

// Create a new idea
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Idea text is required" });
    }

    if (text.length > 280) {
      return res
        .status(400)
        .json({ error: "Idea must be 280 characters or less" });
    }

    const result = await pool.query(
      "INSERT INTO ideas (text) VALUES ($1) RETURNING *",
      [text.trim()],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating idea:", error);
    res.status(500).json({ error: "Failed to create idea" });
  }
});

// Upvote an idea
router.post("/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE ideas SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error upvoting idea:", error);
    res.status(500).json({ error: "Failed to upvote idea" });
  }
});

module.exports = router;
