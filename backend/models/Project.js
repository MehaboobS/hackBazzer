const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  demo: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Software', 'Hardware', 'Miscellaneous'],
    required: true,
  },
  image: {
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming a User model exists
    required: true,
  },
  reviews:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"Review"
  }
});

module.exports = mongoose.model('Project', projectSchema);
