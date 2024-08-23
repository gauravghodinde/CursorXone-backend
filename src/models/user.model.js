
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sex: {
    type: String,
  },
  bio: {
    type:String,
  },
  socialLinks:{
    type: [String],
  },
  // cursorimages: {
  //   type: [String],
  // },
  currentimage:{
    type: String
  }

});

export const User = model('User', userSchema);
