const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  incidentDetails: {
    type: String,
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  reportType: {
    type: String,
    enum: [
        "harassment",
        "unsafe situation",
        "theft",
        "assault",
        "vandalism",
        "suspicious activity",
        "lost item",
        "other",
      ],
    required: true,
  },
  anonymous: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
