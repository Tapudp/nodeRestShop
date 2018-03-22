const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

// handle incoming get requests
router.get('/', (req, res, next) => {
    Order.find()
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        id: mongoose.Types.ObjectId(), // execute as an function to automatically generate an id
        quantity: req.body.quantity,
        product: req.body.productId
    }); // using our model as constructor
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err 
            });
        }); // .exec() to turn it into a real promise
});

router.get('/:orderId', (req, res, next) => {
    res.status(201).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(201).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;