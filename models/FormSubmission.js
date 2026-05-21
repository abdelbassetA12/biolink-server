const mongoose = require('mongoose');

const FormSubmissionSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link'
  },
  data: {
    type: Object // { name: "x", email: "x" }
  },
  ip: String,
  country: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FormSubmission', FormSubmissionSchema);