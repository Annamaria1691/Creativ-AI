import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware.js";
import { registerSchema } from "../utils/validation.js";

dotenv.config();

const router = express.Router();
const PEPPER = process.env.PEPPER;

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // colectează toate erorile, nu doar prima
      stripUnknown: true, // scoate câmpurile care nu sunt în schema
    });

    if (error) {
      // transformăm Joi-error într-un array de mesaje
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ errors: messages });
    }

    req.body = value; // conține acum doar câmpurile validate și curățate
    next();
  };
}

router.post("/register", validateBody(registerSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email and password are required" });
    }

    const fullPassword = password + PEPPER;
    const hashedPassword = await bcrypt.hash(fullPassword, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // Generăm token-ul JWT
    const token = jwt.sign(
      {
        userId: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(201).json({ message: "User created securely", token });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
});

//login cu jwt  + bcrypt + pepper

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Username-ul sau e-mail-ul nu există" });
    }

    const fullPassword = password + PEPPER;

    const isMatch = await bcrypt.compare(fullPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credentiale invalide" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Eroare la login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}!`,
    userId: req.user.userId,
    email: req.user.email,
  });
});

router.put("/profile/email", verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Verifici unicitatea
    const exists = await User.findOne({ email });
    if (exists && exists._id.toString() !== req.user.userId) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Actualizezi
    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { email },
      { new: true, runValidators: true }
    );

    res.json({ message: "Email updated", email: updated.email });
  } catch (err) {
    console.error("Error updating email:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
