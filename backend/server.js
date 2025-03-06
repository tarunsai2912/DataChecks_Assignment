const fs = require("fs");
const express = require("express");
const app = express();

const connectToDb = require("./connect");
const cors = require("cors");
const authRouter = require("./routes/auth");
const storyRouter = require("./routes/stories");
const dataRouter = require("./routes/data");
const bodyParser = require("body-parser");
const { authMiddleware } = require("./middlewares/auth");

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: "X-token",
    "Acess-Control-Allow-Headers": "X-token",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Logging input request
app.use((req, res, next) => {
  const log = `\n${req.method} - ${req.url} - ${new Date()}`;
  fs.appendFile("log.txt", log, (err) => {
    if (err) console.log(err);
  });
  next();
});

app.use("/story", storyRouter);
app.use("/auth", authRouter);
app.use("/data", dataRouter);

app.get('/', (req, res) => {
  res.send("Hello Datachecks")
})

// Handling errors
app.use((err, req, res, next) => {
  const log = `\n${req.method} - ${req.url} - ${new Date()} => ${err.stack}`;
  fs.appendFile("error.txt", log, (err) => {
    if (err) console.log(err);
  });

  res.status(500).json({ err });
});

// Connecting to DB and starting the server.
connectToDb()
  .then(() => {
    console.log("Connected to DB.");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((e) => console.log(e));
