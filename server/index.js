require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const branchRoutes = require("./routes/branchRoutes");
const categoryRoutes = require("./routes/Categories");
const sparePartRoutes = require("./routes/sparePart");
const salesRoutes = require("./routes/sales");
const expensesRoutes = require("./routes/expense");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use(
  rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false })
);

app.get("/api/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/branches", branchRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/spare-parts', sparePartRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/expenses", expensesRoutes);

function printRoutes(app) {
  console.log("[server] registered routes:");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods)
        .filter((m) => middleware.route.methods[m])
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`  ${methods} ${middleware.route.path}`);
    } else if (middleware.name === "router" && middleware.handle && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .filter((m) => handler.route.methods[m])
            .map((m) => m.toUpperCase())
            .join(", ");
          console.log(`  ${methods} ${handler.route.path}`);
        }
      });
    }
  });
}

printRoutes(app);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error("[error]", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT;
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
};
start();

module.exports = app;
