// index.js
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./db/mongodb");

const app = express();

app.use(cors());
app.use(express.json());
const URL = "https://igl-app-v11.onrender.com/random?id=keepOn";

// ⏱️ Har 1 second ping
setInterval(async () => {
  const start = Date.now();

  try {
    const response = await axios.get(URL);
    const end = Date.now();

    console.log("✅ RESPONSE:", response.data.random);
    console.log("⏱️ TIME:", `${end - start} ms`);
    console.log("────────────────────────");

  } catch (error) {
    const end = Date.now();
    console.error("❌ ERROR:", error.message);
    console.log("⏱️ TIME:", `${end - start} ms`);
    console.log("────────────────────────");
  }

},  720000);

// ===========================================
// ⭐ ADVANCED REQUEST LOGGER
// ===========================================
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const clientIp =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    console.log(
      `📌 [${new Date().toISOString()}] ` +
        `IP: ${clientIp} | ` +
        `${req.method} ${req.originalUrl} | ` +
        `Status: ${res.statusCode} | ` +
        `Time: ${Date.now() - start}ms`
    );
  });

  next();
});

// CONNECT MONGODB
connectDB();

const routesPath = path.join(__dirname, "routes");

fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const routeName = "/" + file.replace(".js", "");

    console.log(`🔗 Auto-loading route: ${routeName}`);

    app.use(routeName, require(`./routes/${file}`));
  }
});


app.listen(1000, () => {
  console.log("🚀 Server running on http://localhost:1000");
});
