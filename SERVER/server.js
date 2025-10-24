import "dotenv/config";
import cors from "cors";
import express from "express";
import pool from "./config/db.js";
import helmet from "helmet";
import countryRoutes from "./routes/countryRoutes.js";
import economyRoutes from "./routes/economy.js";

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));

// CORS - must be before routes
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Security (after CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Economy API Server is running!" });
});

app.use("/api", countryRoutes);
app.use("/api", economyRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
