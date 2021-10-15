import jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../../config';
import { UnauthorizedError } from '../../services/ErrorService';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user){
      throw new UnauthorizedError('You must be logged in to proceed with this request');
    }

    req.token = token;
    req.user = user;
    next()
  } catch(err) {
    next(err);
  }
}

module.exports = auth;
