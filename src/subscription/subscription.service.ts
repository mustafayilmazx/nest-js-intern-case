import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './schemas/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel('Subscription')
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  // Creates a new subscription for the given user
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    user,
  ): Promise<Subscription> {
    // Check if the user has the given address
    await this.checkHasAddress(user, createSubscriptionDto.subAddress);

    // Calculate subscription end date as one month after the start date
    const subEndDate = new Date(createSubscriptionDto.subStartDate);
    subEndDate.setMonth(subEndDate.getMonth() + 1);
    await this.checkDate(subEndDate);
    // Create subscription payload with calculated end date and other necessary fields
    const payload = {
      ...createSubscriptionDto,
      subOwner: user.user._id,
      subEndDate,
      isActive: true,
    };

    // Create new subscription and save to database
    const createdSubscription = new this.subscriptionModel(payload);
    const subscription = await createdSubscription.save();

    // Add new subscription ID to the user's subscriptions array and save the user
    user.user.subscriptions.push(subscription._id);
    await user.user.save();

    // Return the created subscription
    return subscription;
  }

  // Checks if the given user has the given address
  private async checkHasAddress(
    user,
    addressId: Schema.Types.ObjectId,
  ): Promise<void> {
    const address = user.user.addresses.find((address) =>
      address._id.equals(addressId),
    );
    if (!address) {
      throw new UnauthorizedException("You don't have this address");
    }
  }

  private async checkDate(date: Date): Promise<void> {
    if (date < new Date()) {
      throw new BadRequestException('Date is in the past');
    }
  }
}
