const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Data = require("../models/Data");
const Stories = require("../models/Stories");
const { authMiddleware } = require("../middlewares/auth");

router.put("/create/:storyId", authMiddleware, async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.body.userId;
    const { bookmark, like } = req.body;

    const data = await Data.findOne({ userId, storyId });
    if (!data) {
      await Data.create({
        storyId,
        userId,
        bookmark,
        like,
      });
    } else {
      const record = await Data.findOne({ userId, storyId });
      await Data.findByIdAndUpdate(record._id, {
        storyId,
        userId,
        bookmark,
        like,
      });
    }

    return res.json({ msg: "Bookmark and like saved." });
  } catch (error) {
    next(error);
  }
});

router.get("/fetch/:storyId", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const storyId = req.params.storyId;

    const record = await Data.findOne({ userId, storyId });
    if (record) {
      return res.json({ bookmark: record.bookmark, like: record.like });
    }
    return res.json({ bookmark: [], like: [] });
  } catch (error) {
    next(error);
  }
});

router.get("/like/:storyId", async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const story = await Stories.findOne({ _id: storyId });
    const records = await Data.aggregate([
      {
        $match: { storyId },
      },
      {
        $unwind: { path: "$like" },
      },
      {
        $group: {
          _id: "$like",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let temp = {};
    records.forEach((record, index) => {
      temp[record._id] = record.count;
    });

    let result = {};
    story.slides.forEach((slide, index) => {
      result[slide._id] = temp[slide._id] || 0;
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/bookmark", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.body.userId;

    const data = await Data.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $unwind: {
          path: "$bookmark",
        },
      },
      {
        $project: {
          storyId: 1,
          bookmark: 1,
          _id: 0,
        },
      },
    ]);

    let result = [];
    async function getSlide() {
      for (const e of data) {
        const temp = await Stories.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(e.storyId) } },
          { $unwind: "$slides" },
          {
            $match: {
              "slides._id": new mongoose.Types.ObjectId(e.bookmark),
            },
          },
        ]);

        let a = {
          storyId: temp[0]._id,
          slide: temp[0].slides,
        };
        result.push(a);
      }
    }
    await getSlide();
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
