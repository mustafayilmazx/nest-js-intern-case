import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { UserAddressService } from '../address/address.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    private userAddressService: UserAddressService,
    private subscriptionService: SubscriptionService,
  ) {}

  // Handles GET requests to /order and returns all orders
  async findAllOrders(currentUser): Promise<Order[]> {
    return currentUser.orders;
  }

  // Handles GET requests to /order/:id and returns a single order
  async findOrderById(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  // Handles POST requests to /order and creates a new order
  async createOrder(payload, currentUser): Promise<Order> {
    // Check if the user owns the address
    await this.checkAddressOwnership(payload.orderAddress, currentUser);
    // Check if the user owns the subscription
    await this.checkSubscriptionOwnership(
      payload.orderSubscription,
      currentUser,
    );

    const createdOrder = new this.orderModel(payload, currentUser);
    const savedOrder = await createdOrder.save();

    // Push the new order to the user's orders array
    currentUser.orders.push(savedOrder._id);
    await currentUser.save();

    return savedOrder;
  }

  private async checkAddressOwnership(
    addressId: Schema.Types.ObjectId,
    userObject,
  ) {
    // Check if the user owns the address
    const address = await this.userAddressService.findAddressById(
      addressId.toString(),
    );
    if (address.owner.toString() !== userObject._id.toString()) {
      throw new ForbiddenException(
        'You do not have permission to use this address.',
      );
    }
  }

  private async checkSubscriptionOwnership(
    subscriptionId: Schema.Types.ObjectId,
    userObject,
  ) {
    // Check if the user owns the subscription
    const subscription = await this.subscriptionService.findSubscriptionById(
      subscriptionId.toString(),
    );
    if (subscription.subOwner.toString() !== userObject._id.toString()) {
      throw new ForbiddenException(
        'You do not have permission to use this subscription.',
      );
    }
  }
}
