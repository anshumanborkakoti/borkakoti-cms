const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const userRouter = require("./routes/users");
const issueRouter = require("./routes/issue.router");
const categoryRouter = require("./routes/category.router");
const authorRouter = require("./routes/author.router");
const postRouter = require("./routes/post.router");
const commentsRouter = require("./routes/comments.router");
const utils = require('./utils');

const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.DB_CONN_STRING,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    utils.logInfo("[APP] Connected to database");
  })
  .catch(e => {
    utils.logError(`[APP] Database connection error`, e);
  });



app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
const allowedOrgins = [
  'https://the-little-journal.com',
  'https://www.the-little-journal.com',
  'http://localhost:4200',
  'http://localhost:4201',
  'http://tljne-staging.s3-website.ap-south-1.amazonaws.com',
  'https://cms.the-little-journal.com'

];
app.use((req, res, next) => {
  const reqOrigin = req.headers['origin'];
  const originIndex = allowedOrgins.findIndex(aOrigin => aOrigin === reqOrigin);
  if (originIndex > -1) {
    res.setHeader("Access-Control-Allow-Origin", reqOrigin);
    res.setHeader("Vary", 'Origin');
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});

app.use("/tljneapi/users", userRouter);
app.use("/tljneapi/issues", issueRouter);
app.use("/tljneapi/categories", categoryRouter);
app.use("/tljneapi/authors", authorRouter);
app.use("/tljneapi/posts", postRouter);
app.use("/tljneapi/comments", commentsRouter);

module.exports = app;
