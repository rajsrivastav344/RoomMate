import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: [".env.local", ".env"] });

// Import database and routes
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";
import contactRoutes from "./routes/contact.js";
import uploadRoutes from "./routes/upload.js";
const chatbotRoutesModule = await import("./routes/chatbot.js");
const chatbotRoutes = chatbotRoutesModule.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// API routes
app.use("/api", chatbotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ Serve React frontend
// 1️⃣ Define client build path
const clientBuildPath = path.join(__dirname, "../client/dist"); // adjust if needed

// 2️⃣ Serve static files
app.use(express.static(clientBuildPath));

// 3️⃣ Catch-all route for React Router
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
