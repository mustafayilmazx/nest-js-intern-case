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

  // Returns all subscriptions for the given user
  async findAllSubscriptions(currentUser): Promise<Subscription[]> {
    return await currentUser.subscriptions;
  }

  // Returns the subscription with the given ID
  async findSubscriptionById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    return subscription;
  }

  // Creates a new subscription for the given user
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    currentUser,
  ): Promise<Subscription> {
    // Calculate subscription end date as one month after the start date
    const subStartDate = new Date(createSubscriptionDto.subStartDate);
    await this.checkDate(subStartDate);

    // Check if the user has the given address
    await this.checkHasAddress(currentUser, createSubscriptionDto.subAddress);

    const subEndDate = new Date(createSubscriptionDto.subStartDate);
    subEndDate.setMonth(subEndDate.getMonth() + 1);

    // Create subscription payload with calculated end date and other necessary fields
    const payload = {
      ...createSubscriptionDto,
      subOwner: currentUser._id,
      subEndDate,
      isActive: true,
    };

    // Create new subscription and save to database
    const createdSubscription = new this.subscriptionModel(payload);
    const subscription = await createdSubscription.save();

    // Add new subscription ID to the user's subscriptions array and save the user
    currentUser.subscriptions.push(subscription._id);
    await currentUser.save();

    // Return the created subscription
    return subscription;
  }

  // Cancels the subscription with the given ID
  async cancelSubscription(currentUser, subscriptionId: string): Promise<void> {
    // Find the subscription with the given ID
    const subscription = await this.subscriptionModel.findOne({
      _id: subscriptionId,
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    // Check if the user has the subscription and can cancel it
    await this.checkHasSubscription(currentUser, subscriptionId);

    // Set the subscription's isActive field to false
    subscription.isActive = false;
    await subscription.save();
  }

  // Checks if the given user has the given subscription
  private async checkHasSubscription(
    currentUser,
    subscriptionId: string,
  ): Promise<void> {
    const subscription = currentUser.subscriptions.find((subscription) =>
      subscription._id.equals(subscriptionId),
    );

    if (!subscription) {
      throw new UnauthorizedException("You don't have this subscription");
    }
  }

  // Checks if the given user has the given address
  private async checkHasAddress(
    currentUser,
    addressId: Schema.Types.ObjectId,
  ): Promise<void> {
    const address = currentUser.addresses.find((address) =>
      address._id.equals(addressId),
    );

    if (!address) {
      throw new UnauthorizedException("You don't have this address");
    }
  }

  // Checks if the given date is valid for subscription start
  private async checkDate(date: Date): Promise<void> {
    if (date.getDay() === new Date().getDay()) {
      throw new BadRequestException('Subscription can start tomorrow.');
    }

    if (date < new Date()) {
      throw new BadRequestException('Date is in the past');
    }
  }
}
