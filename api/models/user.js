const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String,
        required: true,
        unique: true, // unique doesn't give out a valdation but it just stores that, if we add the match email regex it will only accept email format strings in there.
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 
    }, 
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);