const router = require('express').Router();
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const auth =  require('./verifyToken');
const { db } = require('../models/user');
let User = require('../models/user');

const SALT_ROUNDS = 10;

router.get('/subscriptions', auth, async (req, res) => {
  try {
    let user = await User.findOne({username: req.user.username});
    res.json(user.subscriptions);
  }
  catch (err) {
    res.status(400).status({message: err})
  }
});

//route for getting all users - only provides data if session has a logged in user
router.route('/allUsers').get((req,res) => {

    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
    
})

router.route('/username/:username').get(async (req, res) => {
  try {
    let user = await User.findOne({username: req.params.username.toLowerCase()})
    if (user == null) {
      res.json({message: "not found"})
    }
    else {
      res.json({message: "user exists"})
    }
  }
  catch (err) {
    res.json("not found")
  }
});

router.get('/findUser', async (req, res) => {
  try {
    console.log(req.query.username);
    let user = await User.findOne({username: req.query.username.toLowerCase()});
    res.json({posts: user.posts})
  }
  catch (err) {
    console.log(err);
    res.stats(404).json("Not Found");
  }
})

router.get('/findUserSub', async (req, res) => {
  try {
    console.log(req.query.username);
    let user = await User.findOne({username: req.query.username.toLowerCase()});
    res.json({subscriptions: user.subscriptions})
  }
  catch (err) {
    console.log(err);
    res.stats(404).json("Not Found");
  }
})
router.route('/email/:email').get(async (req, res) => {
  try {
    let user = await User.findOne({email: req.params.email.toLowerCase()})
    if (user == null) {
      res.json({message: "not found"})
    }
    else {
      res.json({message: "user exists"})
    }
  }
  catch (err) {
    res.json("not found")
  }
});

// // the request is always made to the same endpoint but contains different req data taken from the form - expects JSON blob
router.route('/signUp').post((req, res) => {
  //TODO server side validation of user data - need constraints
    const username = req.body.username.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    const subscriptions = [{server: "tidder", sub: "general"}]
    const newUser = new User({username, email, password, subscriptions});

    // uses status codes instead of JSON atm but easy to change
    newUser.save().then(() => {
      const token = jwt.sign({username: req.body.username.toLowerCase()}, process.env.TOKEN_SECRET);
      res.header('auth', token).json({token, username, message: 'New User Added and Signed In'});
    }).catch(
      (err) => {  
        
        // need some way of specifying the error
        
        // username is taken
        if (err.keyValue.username === req.body.username) {
            res.json({message: "Username Taken", err: err});
        }
        else {
            res.json({title: "Error", err: err});
        }
      }
    );
  }
)

//router for when a user tries to sign in
// the request is always made to the same endpoint but contains different req data taken from the form - expects JSON blob
router.route('/sign-in').post(async (req, res) => {
    const user = await User.findOne({username: req.body.username.toLowerCase()});
    if (user == null) {
      res.status(404).json({message: "User Does Not Exist"});
    }
    else {
      try {
        if(bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign({username: req.body.username.toLowerCase()}, process.env.TOKEN_SECRET);
          res.header('auth', token).json({token, username: user.username, message: 'User Signed In'});
        } else {
          res.status(400).json({message: 'Incorrect Password'});;
        }
      } catch (err){
        console.log(err)
        res.status(500).json('Error');
      }
    }
});

// Deletes a user given by their id number.
router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json({message: 'User Deleted Using Id'}))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Gets user by ID number.
router.route('/:id').get(async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user == null) {
      res.json("user does not exist");
    }
    // Strip user obj of information that we don't want to share.
    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    user.__v = undefined;
    console.log(user);
    res.json({"details": user});
  }
  catch {
    res.status(400).json("error")
  }
    
});

 

// router.route('/logout').get((req,res) => {

//     //check the session to see if a user is logged in
//     // uses username as the original check did - probably want username when we're doing a proper logot req
//     let username = req.session.user;
//     if (username == undefined) {
//       res.json("NO ONE IS LOGGED IN ")
//     }
//     else {
//         req.session.destroy((err) => {

//         //clear the cookie represnting the session
//         res.clearCookie('connect.sid');
//         // Don't redirect, just print text
//         res.json(username + ' Logged out');
//       });
//     }
// })

// this route will help us get details for the currently signed in user
//checks that the current session has a logged in user
//if so returns the name of that user

// router.route('/user').get(async (req, res) => {
  
//   var check = req.session.userLoggedIn;
//   if(check != undefined && check == true) {
//     res.json(`user ${req.session.user} is signed in`);
//   }
//   else {
//     res.json("user not signed in");
//   }

// });

/*
  we plan on adding few additional requests we can add are: update password for user, change user name
*/

module.exports = router;
