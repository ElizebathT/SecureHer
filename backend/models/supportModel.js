const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  requestDetails: { 
    type: String, 
    required: true },
  status: { 
    type: String, 
    enum: ["active", "completed"], 
    default: "active" 
},
location:{
    latitude: { type: Number  },
      longitude: { type: Number }
  },
  nearbyUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }]
}, { timestamps: true });


const SupportRequest = mongoose.model("SupportRequest", supportRequestSchema);
module.exports = SupportRequest;
