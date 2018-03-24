const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header.authorization;
        console.log(token);
        const decoded = jwt.verify(req.body.token, secret); // decode will only decode, where verify will do that and as well verify
        req.userData = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};