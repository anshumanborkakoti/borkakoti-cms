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

module.exports.saveUserP = ({ name, username, password, email, address, roles }) => {
  const promise = new Promise((resolve, reject) => {
    const tosave = new User({
      name,
      username,
      password,
      email,
      address,
      roles
    });
    tosave.save().then(user => {
      resolve({
        message: 'Saved successfully',
        user
      })
    }, reason => {
      reject({
        message: 'Save user failed!',
        reason
      });
    })
  })
  return promise;
}

module.exports.saveUser = (req, res, next) => {
  this
    .saveUserP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.updateUserP = ({ id }, { name, username, password, email, address, roles }) => {
  const promise = new Promise((resolve, reject) => {
    const toUpdate = new User({
      name,
      _id: id,
      username,
      password,
      email,
      address,
      roles
    });
    User.updateOne({ _id: toUpdate._id }, toUpdate)
      .then(result => {
        if (result.n > 0) {
          resolve({
            message: `User with id ${id} was saved successfully`,
            user: toUpdate
          });
        } else {
          reject({
            message: "Unauthorized to update",
            status: {
              code: 401
            }
          });
        }
      }).catch(error => {
        reject({
          message: "User could not be updated because :" + error,
          status: {
            code: 500
          }
        });
      })
  });

  return promise;

}

module.exports.updateUser = (req, res, next) => {
  this
    .updateUserP(req.params, req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(reason.status.code).json(reason);
    });
}

module.exports.deleteUserP = ({ id }) => {
  const promise = new Promise((resolve, reject) => {
    User.deleteOne({ _id: id })
      .then(result => {
        if (result.n > 0) {
          resolve({
            message: "User deleted",
            status: {
              code: 200
            }
          });
        } else {
          reject({
            message: "Unauthorized to delete",
            status: {
              code: 401
            }
          });
        }
      })
      .catch(error => {
        reject({
          message: "User could not be deleted because :" + error,
          status: {
            code: 500
          }
        });
      });
  });
  return promise;

}

module.exports.deleteUser = (req, res, next) => {
  this
    .deleteUserP(req.params)
    .then(result => {
      res.status(result.status.code).json(result);
    })
    .catch(reason => {
      res.status(reason.status.code).json(reason);
    });
}
