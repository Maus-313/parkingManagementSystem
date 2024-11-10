const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/online_parking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Registration route
app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({ success: true, message: "Registration successful" });
});

// Login route
app.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Compare password with the hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  res.status(200).json({ success: true, message: "Login successful" });
});

// Slot booking route (you can add time and payment details here later)
app.post("/book-slot", (req, res) => {
  // Logic for booking a slot and storing in database
  res.status(200).json({ success: true, message: "Slot booked successfully" });
});

// Payment route (you can add payment gateway integration here later)
app.post("/payment", (req, res) => {
  // Logic for processing the payment
  res.status(200).json({ success: true, message: "Payment successful" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
