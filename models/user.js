const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const File = require('./file');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email address.'],
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
      if (!validator.isEmail(value)) {
        throw new Error('Please provide a valid email address.')
      }
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    trim: true,
    validate(value){
      if (value.toLowerCase().includes('password') || value.length < 8) {
        throw new Error('Please choose a better password of at least 8 characters long.')
      }
    }
  },
  active: {
    type: Boolean,
    default: false
  },
  activationToken: {
    type: String,
    default: crypto.createHash('sha512').update(crypto.randomBytes(32)).digest('hex')
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now()
    }
  }],
  usedStorage: {
    type: Number,
    min: 0,
    max: 1_073_741_824,
    default: 0,
    required: false
  },
  maxStorage: {
    type: Number,
    min: 0,
    max: 1_073_741_824,
    default: 1_073_741_824,
    required: false
  }
}, { timestamps: true });

userSchema.virtual('files', {
  ref: 'File',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.virtual('availableSpace').get(function(){
  return this.maxStorage - this.usedStorage;
});

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = [...this.tokens, {token}];
  return token;
};

userSchema.methods.activateUser = function() {
  this.active = true;
  this.activationToken = '';
};

userSchema.methods.updateUsedStorage = function(filesize){
  this.usedStorage = this.usedStorage + filesize;
};

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  delete userObject._id;
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.active;
  delete userObject.activationToken;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;

  userObject.salt = this.salt;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  // if (!user || !user.active){
  if (!user){
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch){
    throw new Error('Invalid credentials');
  }

  return user;
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})

userSchema.pre('remove', async function(next) {
  await File.deleteMany({ owner: this._id });
  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
