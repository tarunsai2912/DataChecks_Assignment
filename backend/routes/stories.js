const express = require("express");
const router = express.Router();
const Stories = require("../models/Stories");
const Data = require("../models/Data");
const User = require("../models/User");
const { authMiddleware } = require("../middlewares/auth");

// Create story.
router.post("/create", authMiddleware, async (req, res, next) => {
  try {
    const { userId, slides } = req.body;
    const user = await User.findOne({ _id: userId });
    if (user) {
      await Stories.create({
        userId,
        slides,
      });

      return res.json({ msg: "Story created successfully!" });
    } else {
      return res.status(400).json({ msg: "User does not exixts!" });
    }
  } catch (error) {
    next(error);
  }
});

// Get all story of particular user.
router.get("/all", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const result = await Stories.find({ userId });
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get story and particular slide.
router.get("/:id/slide/:slideId", async (req, res, next) => {
  try {
    const { id: storyId, slideId } = req.params;
    const story = await Stories.findOne({ _id: storyId });

    let visitIndex = -1;
    story.slides.forEach((slide, index) => {
      if (slide._id.toString() == slideId) {
        visitIndex = index;
      }
    });
    return res.json({ slides: [...story.slides], visitIndex });
  } catch (error) {
    next(error);
  }
});

// Filter story by categories.
router.get("/stories/:filter", async (req, res, next) => {
  try {
    const filter = req.params.filter;
    const filterArr = filter.split(",");
    const categories = ["medical", "fruits", "world", "india", "education"];

    let result = {};
    async function getData(catArray) {
      for (const cat of catArray) {
        const data = await Stories.find({ "slides.category": cat });
        result = { ...result, [cat]: data };
      }
    }
    if (filter == "all") {
      await getData(categories);
    } else {
      await getData(filterArr);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

// Editing the stories.
router.patch("/edit/:storyId", authMiddleware, async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const { slides } = req.body;

    const bookmarks = await Data.find({ storyId });
    const updateStory = await Stories.findByIdAndUpdate(
      storyId,
      {
        slides: [...slides],
      },
      {
        new: true,
      }
    );

    const slidesId = updateStory.slides.map((slide) => slide._id.toString());

    for (const element of bookmarks) {
      const temp = element.bookmark.filter((id) => slidesId.includes(id));
      await Data.findByIdAndUpdate(element._id, {
        bookmark: temp,
      });
    }
    res.json({ msg: "Updated Sucessfully!!!" });
  } catch (error) {
    next(error);
  }
});

// Get story by story ID.
router.get("/single/:storyId", authMiddleware, async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.body.userId;
    const story = await Stories.findOne({ _id: storyId, userId });
    return res.json(story);
  } catch (error) {
    next(error);
  }
});

// Get random story Id and slide Id
router.get("/random", async (req, res, next) => {
  try {
    const data = await Stories.aggregate([
      {
        $sample: { size: 1 },
      },
      {
        $addFields: {
          slideId: {
            $arrayElemAt: ["$slides._id", 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          slideId: 1,
        },
      },
    ]);

    return res.json(data[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
