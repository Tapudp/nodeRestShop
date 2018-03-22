const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routes which should handle requests
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// mongoose.connect('mongodb+srv://divyeshpar2496@gmail.com:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-nu0dt.mongodb.net/test', {
//     useMongoClient: true
// });
mongoose.connect('mongodb://localhost/AcademingREST');
// to clear that deprecation warning from db Server we can setup the mongoose's promise to global promise
mongoose.Promise = global.Promise;

app.use(morgan('dev')); // Loger middleware which logs out each visit on site into the console
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Aceess-Control-Allow-Header', 'Origin, X-Requested-width, Content-Type, Accept, Authorization'/*it may be '*' */);
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// our own middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found, nthi mltu la');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;