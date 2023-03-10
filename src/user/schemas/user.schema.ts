import { Document, Schema } from 'mongoose';

export interface User extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber: string;
  // add subscriptions id array
  subscriptions: Schema.Types.ObjectId[];
  addresses: Schema.Types.ObjectId[];
  orders: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    // add subscriptions id array
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true },
);
