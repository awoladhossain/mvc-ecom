import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { xss } from "express-xss-sanitizer";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/* Trust proxy */
app.set("trust proxy", 1);

/* Security */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* Rate limiting */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* Parsers */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Logging */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* XSS protection */
app.use(xss());

/* Health */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy 🚀",
  });
});

/* Routes */
app.use("/api/v1", routes);

/* Error handler (ALWAYS LAST) */
app.use(errorHandler);

export default app;
