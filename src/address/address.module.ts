import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAddressService } from './address.service';
import { AddressSchema } from './schemas/address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }]),
  ],
  controllers: [],
  providers: [UserAddressService],
  exports: [UserAddressService],
})
export class AddressModule {}
