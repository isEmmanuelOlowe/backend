let Post = require('./post');

const mongoose = require('mongoose');

const subSchema = new mongoose.Schema ({
    title: {
        type: String,
        unique: true,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    owner: {
        server: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    members: [{
        type: String
    }],

    posts: [{
        type: String
    }],

},
{
    timestamps: true
})

const Sub = mongoose.model('Sub', subSchema);
module.exports = Sub;