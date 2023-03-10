import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // Get user by ID
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Creates a new user in the database
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  // Changes a user's password
  async changePassword(
    user,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const currentPassword = user.user.password;
    const isMatch = await compare(oldPassword, currentPassword);

    // Check if the provided old password matches the user's current password
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Hash and save the new password to the user's account
    user.user.password = await this.hashPassword(newPassword);
    await user.user.save();

    return { message: 'Password changed successfully' };
  }

  // Changes a user's phone number
  async changePhoneNumber(
    user,
    newPhoneNumber: string,
  ): Promise<{ message: string }> {
    // Update the user's phone number and save changes to the database
    user.user.phoneNumber = newPhoneNumber;
    await user.user.save();

    return { message: 'Phone number changed successfully' };
  }

  // Checks if a user has access to an address with the specified ID
  async checkHasAddress(user, addressId: string): Promise<void> {
    const userAddresses = user.user.addresses;
    let addressExist = false;

    // Loop through the user's addresses and check if the specified address ID exists
    addressExist = await userAddresses.some(
      (address) => address._id.toString() === addressId,
    );

    // If the address ID doesn't exist in the user's addresses, throw an unauthorized exception
    if (!addressExist) {
      throw new UnauthorizedException('You are not authorized to access this');
    }
  }

  // Hashes a password using bcryptjs
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }
}
