const express = require("express");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const userRoutes = require("./routes/user");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure the uploads directory exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Node")
  .then(() => console.log("MongoDB Connected"));

// Serve static files before defining routes that may handle file downloads
app.use("/uploads", express.static(uploadDirectory));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// User routes
app.use("/api/users", userRoutes);

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Ensure file is stored in the correct folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`); // Add timestamp to the filename
  }
});

const upload = multer({ storage });

// File upload route
app.post("/api/file/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  console.log("Uploaded file:", req.file); // Log uploaded file details
  res.status(200).json({ message: "File uploaded successfully", file: req.file });
});

// List uploaded files
app.get("/api/file/list", (req, res) => {
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to retrieve files", error: err });
    }
    res.status(200).json({ files });
  });
});

// File download route http://localhost:8000/api/file/download?fileName=bg.png

app.get("/api/file/download", (req, res) => {
  const { fileName } = req.query;
  if (!fileName) {
    return res.status(400).json({ message: "File name is required" });
  }

  const filePath = path.join(uploadDirectory, fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error downloading file", error: err });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
