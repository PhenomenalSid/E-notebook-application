import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import fetchUser from "../middleware/fetchUser.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(newUser);
    res.status(201).json({ success: "Signup Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    const user = await User.findOne({ email });

    console.log(user);

    if (!user) {
      res.status(400).json({ error: "User Not Found" });
    }

    const doMatch = await bcrypt.compare(password, user.password);
    console.log(doMatch);

    if (doMatch) {
      const token = jwt.sign({ userId: user.id }, "" + process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({ token, success: "Login Successful" });
    } else {
      res.status(404).json({ error: "Email And Password Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    console.log("getuser Id", userId);
    const user = await User.findById(userId).select("-password");
    res.send(user);
    console.log("getuser", user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

export default router;
