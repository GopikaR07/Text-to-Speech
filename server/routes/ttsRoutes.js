const express = require("express");
const kokoroVoices = require("../data/kokoroVoices");

require("dotenv").config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text, voice } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    if (!voice) {
      return res.status(400).json({
        success: false,
        message: "Voice is required",
      });
    }

    const selectedVoice = kokoroVoices.find(
      (item) => item.id === voice
    );

    if (!selectedVoice) {
      return res.status(400).json({
        success: false,
        message: "Invalid voice selected",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "hexgrad/kokoro-82m",
          input: text.trim(),
          voice: voice,
          response_format: "mp3",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter error:", errorText);

      return res.status(response.status).json({
        success: false,
        message: "Speech generation failed",
      });
    }

    const audioBuffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error("TTS error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/voices", (req, res) => {
  res.json({
    success: true,
    voices: kokoroVoices,
  });
});

module.exports = router;