// src/routes/feedRoutes.js

const express = require("express");

const {
  getFeeds,
  addFeed,
} = require("../controllers/feedController");

const router = express.Router();

router.get("/", getFeeds);

router.post("/", addFeed);

module.exports = router;