const Feed = require("../config/Feed");

const {
  redisClient,
} = require("../config/redis");

const {
  broadcastFeed,
} = require("../websocket/websocket");

const MAX_CACHED_DATA_LIST = 5;

const REDIS_KEY = "feeds";

// GET FEEDS
const getFeeds = async (req, res) => {
  try {
    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) ||
      MAX_CACHED_DATA_LIST;

    const skip = (page - 1) * limit;

    // GET FROM REDIS
    const cachedFeeds =
      await redisClient.lRange(
        REDIS_KEY,
        0,
        -1
      );

    const cachedCount =
      cachedFeeds.length;

    const parsedCached =
      cachedFeeds.map((item) =>
        JSON.parse(item)
      );

    let feeds = [];

    // FULLY FROM CACHE
    if (
      skip + limit <= cachedCount
    ) {
      feeds = parsedCached.slice(
        skip,
        skip + limit
      );
    }

    // PARTIAL CACHE + DB
    else if (skip < cachedCount) {
      const fromCache =
        parsedCached.slice(skip);

      const remainingNeeded =
        limit - fromCache.length;

      const dbFeeds =
        await Feed.find()
          .sort({
            createdAt: -1,
          })
          .skip(cachedCount)
          .limit(remainingNeeded);

      feeds = [
        ...fromCache,
        ...dbFeeds,
      ];
    }

    // FULLY FROM DB
    else {
      const dbFeeds =
        await Feed.find()
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit);

      feeds = dbFeeds;
    }

    // REFRESH CACHE IF NEEDED
    if (
      cachedCount <
      MAX_CACHED_DATA_LIST
    ) {
      const latestFeeds =
        await Feed.find()
          .sort({
            createdAt: -1,
          })
          .limit(
            MAX_CACHED_DATA_LIST
          );

      await redisClient.del(
        REDIS_KEY
      );

      for (const feed of latestFeeds) {
        await redisClient.rPush(
          REDIS_KEY,
          JSON.stringify(feed)
        );
      }
    }

    // TOTAL COUNT
    const totalCount =
      await Feed.countDocuments();

    // RESPONSE
    res.json({
      feeds,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD FEED
const addFeed = async (req, res) => {
  try {
    const { title, description } =
      req.body;

    // SAVE TO DB
    const newFeed =
      await Feed.create({
        title,
        description,
      });

    // ADD TO REDIS
    await redisClient.lPush(
      REDIS_KEY,
      JSON.stringify(newFeed)
    );

    // KEEP CACHE SIZE FIXED
    await redisClient.lTrim(
      REDIS_KEY,
      0,
      MAX_CACHED_DATA_LIST - 1
    );

    // WEBSOCKET EVENT
    broadcastFeed(newFeed);

    res.status(201).json(
      newFeed
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getFeeds,
  addFeed,
};