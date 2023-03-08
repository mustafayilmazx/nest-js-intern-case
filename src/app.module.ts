import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { OrderModule } from './order/order.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://no7offical:hGDJNiXa502EKE5g@cluster0.lfyhitc.mongodb.net/?retryWrites=true&w=majority',
    ),
    SubscriptionModule,
    UserModule,
    AddressModule,
    OrderModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
