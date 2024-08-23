
import { Schema, model } from 'mongoose';

const cursorimageSchema = new Schema({
  userid: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String
  },
  imagebase64: {
    type: String
  }

});

export const CursorImage = model('CursorImage', cursorimageSchema);
