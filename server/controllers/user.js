const User = require('../models/user.schema');
const Utils = require('../utils');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res, next) => {
  let loggedInUser;
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json(Utils.getErrorResponse("[user.login()] Auth failed", "No user found"));
    }
    loggedInUser = user;
    let passwordComparison = await bcrypt.compare(req.body.password, user.password);
    if (!passwordComparison) {
      return res.status(401).json(Utils.getErrorResponse("[user.login()] Auth failed", "Password invalid"));
    }
    const token = jwt.sign(
      {
        email: loggedInUser.email,
        id: loggedInUser._id
      },
      process.env.JWT_PASS,
      { expiresIn: "30m" }
    );
    res.status(200).json(
      Utils.getInfoResponse(
        "[user.login()] User found",
        {
          token: token,
          expiresIn: 3600,
          username: loggedInUser.username,
          roles: loggedInUser.roles
        }
      )
    );
  } catch (error) {
    res.status(500).json(Utils.getErrorResponse("[user.login()] Login error", error));
  }
};


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
    bcrypt.hash(password, 10)
      .then(hash => {
        const tosave = new User({
          name,
          username,
          password: hash,
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
      .catch(error => {
        reject(
          Utils.getErrorResponse(
            `Save user failed!`,
            error
          )
        );
      });

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

