import { Schema, model, Document } from 'mongoose';

export type UserDocument = {
  name: string;
  lastname: string;
  email: string;
  password: string;
} & Document;

const userSchema = new Schema({
  name: { type: String, maxlength: 30, required: true },
  lastname: { type: String, maxlength: 30 },
  email: { type: String, maxlength: 30, required: true },
  password: { type: String, minlength: 6, required: true },
});

export default model<UserDocument>('User', userSchema);
