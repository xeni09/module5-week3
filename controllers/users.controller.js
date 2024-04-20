const User = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const sessions = require("../middlewares/auth.middlewares");

module.exports.create = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
};

module.exports.list = (req, res) => {
  User.find()
    .then((users) => {
      if (users.length === 0) {
        res
          .status(200)
          .json({ message: "No users found, please create one first" });
      } else {
        res.status(200).json(users);
      }
    })
    .catch(console.error);
};

module.exports.detail = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(console.error);
};

module.exports.update = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
};

module.exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: `User with ID ${req.params.id} has been deleted correctly.`,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(console.error);
};

module.exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(async (user) => {
      if (user && (await bcrypt.compare(req.body.password, user.password))) {
        const token = uuidv4();
        sessions.push({ token, userId: user._id });
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Error in data validation" });
    });
};
