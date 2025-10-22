import "dotenv/config";
import cors from "cors";
import express from "express";
import pool from "./config/db.js";
import helmet from "helmet";
import countryRoutes from "./routes/countryRoutes.js";

const app = express();

//security
app.use(helmet());
app.use(express.json({ limit: "10mb" }));

// connecting to the frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api", countryRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server runing on port ${port}`);
});
