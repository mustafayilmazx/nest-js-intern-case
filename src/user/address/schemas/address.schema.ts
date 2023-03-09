import { Schema, Document } from 'mongoose';

export interface Address extends Document {
  country: string;
  city: string;
  district: string;
  street: string;
  fullAddress: string;
  phoneNumber: string;
  name: string;
  surname: string;
  zipcode: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AddressSchema = new Schema<Address>(
  {
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
    fullAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  { timestamps: true },
);
