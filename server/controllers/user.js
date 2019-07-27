const express = require('express');
const User = require('../models/user.schema');

module.exports.getUsers = (req, res, next) => {
  User.find().then(users => {
    if (users && users.length > 0) {
      res.status(200).json({
        message: 'Hello from users!',
        users
      });
    }
  }, reason => {
    res.status(500).json({
      message: 'Fetch users failed!',
      reason
    });
  });
};

module.exports.saveUser = (req, res, next) => {
  const tosave = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
    roles: req.body.roles
  });
  tosave.save().then(user => {
    res.status(200).json({
      message: 'Saved successfully',
      user
    })
  }, reason => {
    res.status(500).json({
      message: 'Save user failed!',
      reason
    });
  })
}

module.exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const toUpdate = new User({
    name: req.body.name,
    _id: id,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
    roles: req.body.roles
  });
  User.updateOne({ _id: toUpdate._id }, toUpdate)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: `User with id ${id} was saved successfully`,
          user: toUpdate
        });
      } else {
        res.status(401).json({
          message: "Unauthorized to update"
        });
      }
    }).catch(error => {
      res.status(500).json({
        message: "User could not be updated because :" + error
      });
    })
}

module.exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "User deleted"
        });
      } else {
        res.status(401).json({
          message: "Unauthorized to delete"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "User could not be deleted because :" + error
      });
    });
}
