import dotenv from "dotenv";
import express from "express";

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
    environment: NODE_ENV,
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`http://localhost:${PORT}/`);
});
