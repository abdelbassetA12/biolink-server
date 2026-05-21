const mongoose = require('mongoose');


const LinkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  type: {
    type: String,
    enum: ["link", "video", "whatsapp", "gallery", "form", "youtube", "product"],
    default: "link"
  },
  content: {
    url: String,
    videoUrl: String,
    phone: String,
    message: String,
    images: [String],

    productUrl: String,
     productDisplay: {
    type: String,
    enum: ["link", "card"],
    default: "card"
  },
     productData: {
    title: String,
    image: String,
    price: String,
    description: String
  },

    
    formFields: [
  {
    label: String,
    type: {
      type: String,
      enum: ["text", "email", "textarea"]
    },
    required: { type: Boolean, default: false },
    placeholder: String
  }
],

formSettings: {
  submitText: { type: String, default: "Send" },
  successMessage: { type: String, default: "Message sent!" }
},
     // ✅ جديد YouTube
  youtubeUrl: String,
  youtubeMode: {
  type: String,
  enum: [
    "open",
    "embed",
    "channel",
    "latest-open",
    "latest-embed",
    "playlist"
  ],
  default: "open"
},


  },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  clicks: { type: Number, default: 0 },
  clicksHistory: [
    {
      date: { type: Date, default: Date.now },
      ip: String,
      userAgent: String,
      country: String,
    }
  ]
});

module.exports = mongoose.model('Link', LinkSchema);