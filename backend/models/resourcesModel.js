const mongoose = require('mongoose');

const educationalResourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  type: { 
    type: String, 
    enum: ["video", "article", "image"], 
    required: true 
},
  content: { 
    type: String, 
    required: true 
},
  author: { 
    type: String, 
    required: true 
},
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});

const EducationalResource = mongoose.model("EducationalResource", educationalResourceSchema);
module.exports = EducationalResource;
