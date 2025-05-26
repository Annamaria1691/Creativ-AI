import express from "express";
import fs from "fs";
import path from "path";
import { generateImageWithDeepAI } from "../utils/deepai.js";
import cloudinary from "../utils/cloudinary.js";
import Image from "../models/Image.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import axios from "axios";

const router = express.Router();

router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { prompt, title } = req.body;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const countToday = await Image.countDocuments({
      userId: req.user.userId,
      createdAt: { $gte: startOfDay },
    });

    if (countToday >= 10) {
      return res
        .status(429)
        .json({ error: "You have reached your 10 images limit!" });
    }

    const imageUrl = await generateImageWithDeepAI(prompt);

    const filename = `temp-${Date.now()}.jpg`;
    const filepath = path.resolve("temp", filename);
    const writer = fs.createWriteStream(filepath);

    const imageResponse = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    imageResponse.data.pipe(writer);

    writer.on("finish", async () => {
      const result = await cloudinary.uploader.upload(filepath, {
        folder: "ai-gallery",
      });

      fs.unlinkSync(filepath);

      const newImage = new Image({
        title,
        imageUrl: result.secure_url,
        prompt,
        userId: req.user.userId,
      });

      await newImage.save();
      res.status(201).json(newImage);
    });

    writer.on("error", (err) => {
      console.error("Error on downloading image:", err);
      res.status(500).json({ error: "Error on downloading image" });
    });
  } catch (err) {
    console.error("Error on generating/upload image:", err.message);
    res.status(500).json({ error: "Image generating faild." });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Image.countDocuments({ userId: req.user.userId });

    const images = await Image.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalImages: total,
      images,
    });
  } catch (err) {
    console.error("Eroare la paginare:", err);
    res.status(500).json({ error: "Eroare la încărcare imagini" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const image = await Image.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json({ message: "Image deleted succesfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error on deleteing image!" });
  }
});
router.get("/today-count", verifyToken, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const countToday = await Image.countDocuments({
      userId: req.user.userId,
      createdAt: { $gte: startOfDay },
    });

    const DAILY_LIMIT = 10;
    res.json({
      countToday,
      remaining: Math.max(DAILY_LIMIT - countToday, 0),
      dailyLimit: DAILY_LIMIT,
    });
  } catch (err) {
    console.error("Eroare la today-count:", err);
    res.status(500).json({ error: "Nu s-a putut calcula numărul imaginiilor" });
  }
});

export default router;
