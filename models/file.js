const mongoose = require('mongoose')
const { promisify } = require('util')
const fs = require('fs')
const User = require('./user')
const Schema = mongoose.Schema

const deleteFile = promisify(fs.unlink);
// const readdir = promisify(fs.readdir)
// const stat = promisify(fs.stat)

const fileSchema = new Schema({
  name: {
    type: String,
	  required: true
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
  }
}, { timestamps: true });

// fileSchema.index({ expireAfterSeconds: 30 })

fileSchema.virtual('downloadUrl').get(function(){
  return `http://localhost:3000/download/${this._id}`;
});

fileSchema.virtual('filepath').get(function(){
  return `${this.directory}/${this.name}`;
});

const File = mongoose.model('Files', fileSchema);

module.exports = File;
