require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");

// Import Models
const Message = require("./models/Message");

// Import Routers
const UserRouter = require("./router/user");
const RestaurantRouter = require("./router/restaurants");
const MenuRouter = require("./router/menu");
const CartRouter = require("./router/Cart");
const SavedItemRoutes = require("./router/savedItems");
const OrderRouter = require("./router/order");
const SearchRouter = require("./router/search");
const AdminRouter = require("./router/admin");
const adminNotificationRouter = require("./router/adminNotifications");
const settingsRouter = require("./router/settings");
const ratingRouter = require("./router/rate");
const adminRoutes = require("./router/adminRoutes");
const paymentRouter = require("./router/payment");
const foodRoutes = require("./router/food");
const messageRouter = require("./router/message");

const app = express();
// Render usually uses port 10000, process.env.PORT handles this automatically
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = "https://food-delivery-app-yfr9.onrender.com";
const DASHBOARD_URL = "https://food-delivery-dashboard-yfr9.onrender.com";

// -----------------------------------------------------------------------------
// HTTP SERVER + SOCKET.IO SETUP
// -----------------------------------------------------------------------------
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [FRONTEND_URL, DASHBOARD_URL, "http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true // Support older clients if any
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_chat", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their support chat room`);
  });

  socket.on("join_admin", () => {
    socket.join("admin_room");
    console.log("Admin joined the global support room");
  });

  socket.on("send_message", async (data) => {
    const { receiverId, message, role, senderId } = data;
    try {
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        role,
        timestamp: new Date()
      });
      await newMessage.save();

      io.to(receiverId).emit("receive_message", {
        senderId,
        message,
        role,
        timestamp: newMessage.timestamp
      });

      if (role === 'user') {
        io.to("admin_room").emit("new_admin_message", {
          senderId,
          message,
          role,
          timestamp: newMessage.timestamp
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// -----------------------------------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------------------------------
app.use(
  cors({
    origin: [FRONTEND_URL, "https://food-delivery-dashboard-yfr9.onrender.com", "http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// -----------------------------------------------------------------------------
// REQUEST LOGGER
// -----------------------------------------------------------------------------
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body present: ${!!req.body}`);
  }
  next();
});

// -----------------------------------------------------------------------------
// HEALTH CHECK
// -----------------------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState,
    message: "Backend diagnostics active. Version 1.1"
  });
});

// -----------------------------------------------------------------------------
// MONGO DB CONNECTION
// -----------------------------------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/food_ordering")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// -----------------------------------------------------------------------------
// API ENDPOINTS
// -----------------------------------------------------------------------------
app.use("/food-ordering-app/api/user", UserRouter);
app.use("/api/restaurants", RestaurantRouter);
app.use("/api/menu", MenuRouter);
app.use("/api/cart", CartRouter);
app.use("/api/saved", SavedItemRoutes);
app.use("/api/order", OrderRouter);
app.use("/api/search", SearchRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/admin/notifications", adminNotificationRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/rate", ratingRouter); 
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/foods", foodRoutes);
app.use("/api/messages", messageRouter);

// -----------------------------------------------------------------------------
// PAYPAL CONFIG
// -----------------------------------------------------------------------------
app.get("/api/payment/config", (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID || "" });
});

// -----------------------------------------------------------------------------
// 404 & ERROR HANDLERS
// -----------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// -----------------------------------------------------------------------------
// START SERVER
// -----------------------------------------------------------------------------
const startServer = (port) => {
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📡 Allowing CORS from: ${FRONTEND_URL}`);
  }).on('error', (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`⚠ Port ${port} in use, trying ${port + 1}`);
      startServer(Number(port) + 1);
    } else {
      console.error(err);
    }
  });
};

startServer(PORT);