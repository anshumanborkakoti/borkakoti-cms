const express = require('express');
const User = require('../models/user.schema');
const Utils = require('../utils');

module.exports.getUsers = (req, res, next) => {
  User.find().then(users => {
    if (users && users.length > 0) {
      res.status(200).json(
        Utils.getInfoResponse(
          `Users fetched successfully!`,
          { users }
        )
      );
    }
  }, reason => {
    res.status(500).json(
      Utils.getErrorResponse(
        `Fetch users failed!`,
        reason
      )
    );
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
      resolve(
        Utils.getInfoResponse(
          `Saved successfully`,
          { user }
        )
      )
    }, reason => {
      reject(
        Utils.getErrorResponse(
          `Save user failed!`,
          reason
        )
      );
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
          resolve(
            Utils.getInfoResponse(
              `User with id ${id} was saved successfully`,
              { user: toUpdate }
            )
          );
        } else {
          reject(
            Utils.getErrorResponse(
              `Unauthorized to update`,
              '401'
            )
          );
        }
      }).catch(error => {
        reject(
          Utils.getErrorResponse(
            `User could not be updated`,
            error
          )
        );
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
      res.status(500).json(reason);
    });
}

module.exports.deleteUserP = ({ id }) => {
  const promise = new Promise((resolve, reject) => {
    User.deleteOne({ _id: id })
      .then(result => {
        if (result.n > 0) {
          resolve(
            Utils.getInfoResponse(
              `User deleted`,
              {}
            )
          );
        } else {
          reject(
            Utils.getErrorResponse(
              `Unauthorized to delete`,
              '401'
            )
          );
        }
      })
      .catch(error => {
        reject(
          Utils.getErrorResponse(
            `User could not be deleted`,
            error
          )
        );
      });
  });
  return promise;

}

module.exports.deleteUser = (req, res, next) => {
  this
    .deleteUserP(req.params)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

