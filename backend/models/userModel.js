const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
phone:{
  type:Number,
  // unique:true
},
location:{
  latitude: { type: Number  },
    longitude: { type: Number }
},
  password: { 
    type: String
},
verified:{
  type:Boolean,
  default:false
},
  emergencyContacts: [
    { 
        type: String 
    }
], // Can store user IDs or phone numbers
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
