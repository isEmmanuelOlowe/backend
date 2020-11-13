const mongoose = require('mongoose');

//Defines the schema for a user in the DB.
const Schema = mongoose.Schema;

//For now only includes username & password.
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 5
    },
    subscriptions : [
        {
            server: String,
            sub: String
        }
    ],
    posts : [{
        server: String,
        sub: String,
        postID: String
    }]
}, {
    timestamps: true
});

//Allows the schema to be used outside of the file.
const User = mongoose.model('User', userSchema);
module.exports = User; 
