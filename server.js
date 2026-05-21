

require("dotenv").config();
const express = require("express");

const cors = require("cors");
const http = require("http");

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const helmet = require("helmet");

const rateLimit = require("express-rate-limit");

const app = express();
//app.use(express.json());

app.use(express.json({
  limit: "10mb"
}));

app.use(cookieParser());
app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

//app.use(cors());
/*
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
*/
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://biolink-client.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true
}));




// 🔥 socket
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
 
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10
  })
);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));




// تشغيل السيرفر
server.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});






