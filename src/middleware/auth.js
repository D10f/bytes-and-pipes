const jwt = require('jsonwebtoken')
const User = require('../server/models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id })

    if (!user){
      throw new Error()
    }

    req.token = token
    req.user = user
    next()
  } catch(err) {
    res.status(401).send(err)
  }
}

module.exports = auth
