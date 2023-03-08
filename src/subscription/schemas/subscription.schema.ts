import { Schema, Document } from 'mongoose';

export interface Subscription extends Document {
  subStartDate: Date;
  subEndDate: Date;
  subStatus: boolean;
  subOwner: Schema.Types.ObjectId;
}

export const SubscriptionSchema = new Schema<Subscription>(
  {
    subStartDate: { type: Date, required: true },
    subEndDate: { type: Date, required: true },
    subStatus: { type: Boolean, required: true },
    // subOwner ref to user model
    subOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);
