const auth =  require('./verifyToken');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const { db } = require('../models/post');
let Post = require('../models/post');
let User = require('../models/user');
let Sub = require('../models/sub');
//route for getting data on all posts 
router.route('/allPosts').get((req,res) => {
    Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
    
})

// the request is always made to the same endpoint but contains different req data taken from the form - expects JSON blob
router.post('/addPost', auth, (req, res) => {
  //TODO server side validation of user data - need constraints
  console.log(req.body);
  const post = {
    title: req.body.title,
    sub: req.body.sub,
    body: req.body.post,
    user: {server: "tidder", username:req.user.username},
  }
    const newPost = new Post(post);
    // uses status codes instead of JSON atm but easy to change
    newPost.save().then(() => {
      User.findOne({username: req.user.username})
      .then(user => {
        user.posts.push({server: "tidder", sub:req.body.sub, postID: newPost._id})
        User.findByIdAndUpdate(user._id, {posts: user.posts}).catch()
      }).catch();
      Sub.findOne({title: req.body.sub})
        .then(sub => {
          console.log("Help Me")
          sub.posts.push(newPost._id);
          console.log(sub.posts);
          Sub.findByIdAndUpdate(sub._id, {posts: sub.posts}).catch();
        }).catch();
      res.json({postID: newPost._id});
    }).catch(
      (err) => {  // need some way of specifying the error
        console.log(err);
        res.status(400).json({message: err});
      }
    );
  }
)

router.post('/addComment', auth, (req, res) => {
      Post.findById(req.body.postID)
      .then(
          post => {
            currentComments = post.comments
            // ADDING NEW COMMENT
            currentComments.push({body: req.body.comment, user: {server: "tidder", username: req.user.username}})
            Post.findByIdAndUpdate(req.body.postID, {comments: currentComments})
            .then(() => res.json({message: "Comment Added"}))
            .catch(err => res.status(400).json("Error: " + err));
          }
      )
      .catch(err => {
        console.log(err)
        res.status(400).json('Error: ' + err)
      });
  }
)


router.route('/:id').delete((req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json({message: 'Post deleted using id'}))
    .catch(err => res.status(400).json('Error: ' + err));
});

// getting data on a single post by id
router.route('/:id').get(async (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.json(post);
    }
    else {
      res.json({message: "Invalid post ID"})
    }
  })
  .catch(err => {
    res.status(400).json('Error: ' + err)});
});


// get all posts by a particular user
router.route('/myposts/:username').get((req,res) => {
  Post.find({username: req.params.username})
  .then(posts => res.json(posts))
  .catch(err => res.status(400).json('Error: ' + err));
})


module.exports = router;
