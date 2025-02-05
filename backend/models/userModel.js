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
  password: { 
    type: String
},
  emergencyContacts: [
    { 
        type: String 
    }
], // Can store user IDs or phone numbers
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
