const express = require("express");
const cors = require("cors");
const ttsRoutes = require("./routes/ttsRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tts", ttsRoutes);

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TTS backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});