import { Document, Schema } from 'mongoose';

export interface Subscription extends Document {
  subStartDate: Date;
  subEndDate: Date;
  isActive: boolean;
  subOwner: Schema.Types.ObjectId;
  subAddress: Schema.Types.ObjectId;
}

export const SubscriptionSchema = new Schema<Subscription>(
  {
    subStartDate: { type: Date, required: true },
    subEndDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
    // subOwner ref to user model
    subOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  },
  { timestamps: true },
);
