require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const ideasRouter = require("./routes/ideas");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allows requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In production, you might want to be more restrictive
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      // Add your AWS Lightsail IP/domain here
    ].filter(Boolean);

    // Allow all origins in development, or if origin is in allowed list
    if (
      process.env.NODE_ENV === "development" ||
      allowedOrigins.some((allowed) => origin.startsWith(allowed))
    ) {
      callback(null, true);
    } else {
      callback(null, true); // For simplicity, allowing all origins
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/ideas", ideasRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Wait a bit for PostgreSQL to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await initDb();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
