const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    body: String,
    username: String,
    createdAt: String    
},
{
    timestamps: true
})

module.exports = commentSchema;