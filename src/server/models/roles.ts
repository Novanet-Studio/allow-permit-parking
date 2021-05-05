import { model, Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface RoleDocument extends Document {
  _id: string;
  name: string;
}

export const ROLES = ['admin', 'clerk', 'driver', 'resident'];

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  },
);

export default model<RoleDocument>('Role', roleSchema);
