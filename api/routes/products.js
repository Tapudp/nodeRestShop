const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// taking the schema from databse model
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find() //  queries like .find() returns event method but not catch so need to turn it into real promise
        .select('name price _id')
        .exec()
        .then(docs => {
            //console.log(docs);
            //if(doc.length >= 0){
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {// we can use the spread operator  '...' to spread the array there
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: { // this is a javascript Object
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc._id
                        }                         
                    }
                })
            };
            res.status(200).json(response);
            //  } else {
            //      res.status(404).json({ message: 'No entries Found though it is an empty error'});
            //  } //it returns an empty array when GET but it's not actually an error
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.status(200).json({
    //     message: 'Handling GET request to /products'
    // });
});

router.post('/', (req, res, next) => {
    // const product = {
    //     name: req.body.name, 
    //     price: req.body.price
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
     .save()
     .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
     })
     .catch(err =>{
        console.log(err);
        res.status(500).json({ error: err });   
     }); // save() method is from MongoDB this is also a promise | we can also use .exec() for error handling in that
    // we sent the response immediately we didn't wait for the success code to complete
     
});

router.get('/:productId',(req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost/products/' // list of all prodcuts
                    }
                });
            } else {
                res
                    .status(404)
                    .json({message: 'No valid entry found fo provided ID aavu nai biju naakho'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        }); // static method on that object
        // we can't write code here as above is not complete like async/await
    // dummmy code wrote earlier
    /*if(id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        })
    }*/
});

router.patch('/:productId',(req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    } // this dynamic approach ensures that we really can send differnet types of PATCH requests for the two different vaiables in the jSON 'name' and 'price'
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            //console.log(result);
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.status(200).json({
    //     message: 'Updated product with productID of `${id}`!',
    //     id: id
    // });
});

router.delete('/:productId',(req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: {name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

    // res.status(200).json({
    //     message: 'Deleted product!'
    // });
});

module.exports = router;