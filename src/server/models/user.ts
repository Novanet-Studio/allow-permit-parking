import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';

interface UserDocument extends Document {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
});

export default model<UserDocument>('User', userSchema);
