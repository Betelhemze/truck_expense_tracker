const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

module.exports = router;
