import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressModule } from 'src/address/address.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { OrderService } from './order.service';
import { OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    AddressModule,
    SubscriptionModule,
  ],
  controllers: [],
  exports: [OrderService],
  providers: [OrderService],
})
export class OrderModule {}
