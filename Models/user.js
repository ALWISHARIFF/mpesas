// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  applicationName: {
    type: String,
    required: true,
  
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
