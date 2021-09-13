const mongoose = require('mongoose');
// const { promisify } = require('util');
const fs = require('fs');
const User = require('./user');
const Schema = mongoose.Schema;

// const unlink = promisify(fs.unlink);

const fileSchema = new Schema({
  name: {
    type: String,
	  required: true
  },
  encryptedMetadata: {
    type: Buffer
  },
  directory: {
    type: String,
    required: true
  },
  size: {
  	type: Number,
	  required: true
  },
  expired: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h'
  }
}, { timestamps: true });

fileSchema.virtual('downloadUrl').get(function(){
  return `${process.env.DOMAIN}/d/${this._id}`;
});

fileSchema.virtual('filepath').get(function(){
  return `${this.directory}/${this.name}`;
});

fileSchema.pre('remove', function(next) {
  fs.unlink(`${this.directory}/${this.name}`);
  next();
});

const File = mongoose.model('Files', fileSchema);

module.exports = File;
