const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;
