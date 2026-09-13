const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: "Text is required",
    });
  }

  res.json({
    success: true,
    message: "Text received successfully",
    text: text.trim(),
  });
});

module.exports = router;