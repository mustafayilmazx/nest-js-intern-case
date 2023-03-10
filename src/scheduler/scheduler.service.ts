import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { OrderService } from '../order/order.service';
import { Subscription } from '../subscription/schemas/subscription.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class SchedulerService {
  constructor(
    private orderService: OrderService,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    private userService: UserService,
  ) {}

  // This function is called every minute
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const logger = new Logger(SchedulerService.name);
    logger.log('Cron job running');
    // Get all expired subscriptions
    const expiredSubscriptions = await this.getExpiredSubscriptions();

    // For each expired subscription, create a new order
    for (const expiredSubscription of expiredSubscriptions) {
      // Get the user who owns the expired subscription
      const user = await this.userService.findUserById(
        expiredSubscription.subOwner.toString(),
      );

      // Create a new order for the expired subscription
      await this.orderService.createOrder(
        {
          orderAddress: expiredSubscription.subAddress,
          orderSubscription: expiredSubscription._id,
          orderDate: new Date(),
          isPaid: false,
          orderOwner: user._id,
        },
        user,
      );

      // Update the subscription's subEndDate field to the end of the next month
      const subEndDate = new Date();
      subEndDate.setMonth(subEndDate.getMonth() + 1);
      expiredSubscription.subEndDate = subEndDate;
      await expiredSubscription.save();
    }
    logger.log('Cron job finished');
  }

  // This function returns all the expired subscriptions
  private async getExpiredSubscriptions(): Promise<Subscription[]> {
    const now = new Date();
    return await this.subscriptionModel
      .find({ isActive: true, subEndDate: { $lt: now } })
      .exec();
  }
}
