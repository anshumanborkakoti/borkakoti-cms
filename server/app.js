const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const userRouter = require('./routes/users');

const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://anshuman:znTSxedRPfAV38Vi@cluster0-rnjrw.mongodb.net/tljnesandbox?retryWrites=true&w=majority',
    // 'mongodb+srv://anshuman:' +
    // //process.env.MONGO_ATLAS_PASS +
    // 'znTSxedRPfAV38Vi' +
    // '@cluster0-rnjrw.mongodb.net/tljnesandbox',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Database connection error');
  });

//DB username: anshuman PAssword: znTSxedRPfAV38Vi

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT, DELETE,PATCH,OPTIONS'
  );
  next();
});

app.use('/tljneapi/users', userRouter);
module.exports = app;
