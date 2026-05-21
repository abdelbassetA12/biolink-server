const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  
 username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  //username: String,
  //password: String,
  bio: String,
  avatar: String,
  theme: { type: String, default: 'theme1' },
  socialIcons: [
    {
      platform: String,  // مثال: 'facebook', 'twitter'
      url: String,
      active: { type: Boolean, default: true }
    }
  ]
});