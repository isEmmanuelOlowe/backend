const jwt = require('jsonwebtoken');

module.exports = function auth (req, res, next) {
    let token = req.body.token;
    if(!token) {
        token  = req.query.token;
    }
    if(!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next()
    }
    catch (err) {
        console.log(err)
        res.status(400).send('Invalid Token')
    }
}