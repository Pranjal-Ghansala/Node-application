const mongoose = require("mongoose");

// Define the schema for uploaded files
const fileSchema = new mongoose.Schema({
 
  fileName: {
    type: String,
    required: true,
    unique: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  
  
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

 
const File = mongoose.model("File", fileSchema);

module.exports = File;
