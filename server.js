const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-adminsdk.json")),
});
const db = admin.firestore();

// Multer for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware for JWT Authentication
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Access denied" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// User Registration (Sign Up)
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userRef = db.collection("users").doc(email);
    await userRef.set({ name, email, password, createdAt: new Date() });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Food Listing
app.post("/food", verifyToken, upload.single("image"), async (req, res) => {
  const { title, description, price, location, postedBy, expiryDate } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
  try {
    const foodRef = db.collection("food").doc();
    await foodRef.set({ title, description, price, location, postedBy, imageUrl, expiryDate, createdAt: new Date() });
    res.status(201).json({ message: "Food listing created" });
  } catch (error) {
    res.status(500).json({ error: "Error adding food" });
  }
});

// Request Food
app.post("/food/request", verifyToken, async (req, res) => {
  const { foodId, requestedBy } = req.body;
  try {
    const requestRef = db.collection("foodRequests").doc();
    await requestRef.set({ foodId, requestedBy, status: "pending", requestedAt: new Date() });
    res.status(201).json({ message: "Food request sent" });
  } catch (error) {
    res.status(500).json({ error: "Error requesting food" });
  }
});

// Fetch Food Listings
app.get("/food", async (req, res) => {
  try {
    const { query } = req.query;
    let foodRef = db.collection("food");
    let foodSnapshot;
    
    if (query) {
      foodSnapshot = await foodRef
        .where("location", "==", query)
        .get();
    } else {
      foodSnapshot = await foodRef.get();
    }
    
    const foodList = foodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(foodList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching food listings" });
  }
});

// Search Food by Title or Location
app.get("/food/search", async (req, res) => {
  try {
    const { query } = req.query;
    let foodRef = db.collection("food");
    let foodSnapshot;
    
    if (query) {
      foodSnapshot = await foodRef
        .where("location", "==", query)
        .get();
    } else {
      foodSnapshot = await foodRef.get();
    }
    
    const foodList = foodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(foodList);
  } catch (error) {
    res.status(500).json({ error: "Error searching for food" });
  }
});

// Real-Time Notifications with WebSockets
const server = app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
const io = socketIo(server);
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("newFood", (data) => {
    io.emit("foodAdded", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Google Maps API (Placeholder for future implementation)
app.get("/food/locations", async (req, res) => {
  try {
    const foodSnapshot = await db.collection("food").get();
    const locations = foodSnapshot.docs.map(doc => doc.data().location);
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching food locations" });
  }
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});
