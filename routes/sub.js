const router = require('express').Router();
const auth =  require('./verifyToken');
let Sub = require('../models/sub')
let User = require('../models/user');
const { subscribe } = require('./posts');
//Route for getting subs
router.route('/').get((req, res) => {
    Sub.findOne({title: req.query.title})
        .then(sub => { if   (sub) {
            console.log(sub)
            res.json(sub)
        }
        else {
            res.status(400).json({error: "Not Found"})
        }
        })
        .catch(err => {
            res.status(400).json({error: err})
        })
});

router.route('/subname/:name').get(async (req, res) => {
    try {
      let user = await Sub.findOne({title: req.params.name.toLowerCase()})
      if (user == null) {
        res.json({message: "not found"})
      }
      else {
        res.json({message: "sub exists"})
      }
    }
    catch (err) {
      res.json("not found")
    }
  });

//Route for adding subs
router.post('/create', auth, (req, res) => {
    const sub = {
        title: req.body.subName.toLowerCase(),
        description: req.body.description,
        owner: {server: "tidder", username: req.user.username},
        members: [req.user.username]
    }
    const newSub = new Sub(sub);
    newSub.save().then(() => {
       User.findOne({username: req.user.username})
        .then(user => {
          user.subscriptions.push({server: "tidder", sub: req.body.subName.toLowerCase()})
          User.findByIdAndUpdate(user._id, {subscriptions: user.subscriptions}).catch()
        });
        res.json({message: "added"})
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({Error: err})
    })
})

//route for getting all subs 
router.route('/allSubs').get((req,res) => {

    Sub.find()
    .then(subs => res.json(subs))
    .catch(err => res.status(400).json('Error: ' + err));
    
})

// Gets sub by ID number.
router.route('/:id').get(async (req, res) => {
    let sub = await Sub.findById(req.params.id);
    if (sub == null) {
      res.json("user does not exist");
    } else {
      res.json({"details": sub});
    }
   });

module.exports = router