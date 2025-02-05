const mongoose = require('mongoose');

const DistressSignalSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number  },
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['pending', 'resolved'], 
        default: 'pending' 
    }
});


const DistressSignal = mongoose.model("DistressSignal", DistressSignalSchema);
module.exports = DistressSignal;
