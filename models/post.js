const mongoose = require('mongoose');

//Defines the schema for a user in the DB.
const Schema = mongoose.Schema;

//For now only includes username & password.
const postSchema = new Schema({
    sub: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
      username: {
        type: String,
        required: true
      },
      server: {
        type: String,
        required: true
      }
    },
    comments: [ {
      type: new Schema({
        body: String,
        server:String,
        username: String,
        createdAt: String
      }, {timestamps: true})
    }],
    votes: {
        
      upvotes: [
          {
            type: new Schema ({
              server: String,
              username: String
            }, {timestamps: true})
          }
        ],
      downvotes: [
          {
            type: new Schema ({
              server: String,
              username: String
            }, {timestamps: true})
          }
        ],
    },
}, {
  timestamps: true
});

//Allows the schema to be used outside of the file.
const Post = mongoose.model('Post', postSchema);
module.exports = Post; 
