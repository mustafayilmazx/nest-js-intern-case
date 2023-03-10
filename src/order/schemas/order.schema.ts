import { Document, Schema } from 'mongoose';

export interface Order extends Document {
  orderDate: Date;
  orderOwner: Schema.Types.ObjectId;
  orderAddress: Schema.Types.ObjectId;
  isPaid: boolean;
  orderSubscription: Schema.Types.ObjectId;
}

export const OrderSchema = new Schema<Order>({
  orderDate: { type: Date, required: true },
  orderAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  orderOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPaid: { type: Boolean, required: true },
  orderSubscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
});
