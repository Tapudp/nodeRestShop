const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({
          message: "Email exists, try adding some other email address"
        }); // 409 for the conflict with the resources available
      } else {
        bcrypt.hash(req.body.password, 10 /*salting rounds*/, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            }); //req.body.password // it's a security flow to store a raw password in the database
            //also it is not synchronous so we have to do it like this.
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          // 401 means unauthorised
          message: "Auth failed "
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign({ // this will run synchronously and give you this token
            email: user[0].email,
            userId: user[0]._id
          },  // 3rd argument is a javaScript object
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
          // last argument is a callback
        );
          return res.status(200).json({
            message: "Auth Successful",
            token: token
          });
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
