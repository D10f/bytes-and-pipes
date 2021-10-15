const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user){
      throw new Error('You must be logged in to proceed with this request');
    }

    req.token = token;
    req.user = user;
    next()
  } catch(err) {
    res.status(401).send(err)
  }
}

module.exports = auth
