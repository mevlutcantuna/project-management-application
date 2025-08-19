import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error";
import { db } from "./config/dbClient";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "*",
    allowedHeaders: "*",
  })
);

// express.json() is used to parse JSON bodies
// such as { name: "John", age: 20 }
app.use(express.json());

// express.urlencoded() is used to parse URL-encoded bodies
// such as form data like ?name=John&age=20
// extended = true is used to parse nested objects
// such as parse ?name[first]=John&name[last]=Doe
// if extended = false, it will only parse the first level of the object
// such as parse ?name=John&age=20
app.use(express.urlencoded({ extended: true }));

// Helmet is used to secure the app by setting various HTTP headers
// such as Content-Security-Policy, X-Frame-Options, etc.
app.use(helmet());

// Routes
app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

// Process-level safety nets
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// Database health check and server startup
async function startServer() {
  try {
    // Check database connection
    const isDbHealthy = await db.healthCheck();

    if (!isDbHealthy) {
      console.warn("Database connection failed, but server will start anyway");
    } else {
      console.log("Database connection established successfully");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
