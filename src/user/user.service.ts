import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async changePassword(
    user,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const currentPassword = user.user.password;
    const isMatch = await compare(oldPassword, currentPassword);

    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    user.user.password = await this.hashPassword(newPassword);
    await user.user.save();

    return { message: 'Password changed successfully' };
  }

  async changePhoneNumber(
    user,
    newPhoneNumber: string,
  ): Promise<{ message: string }> {
    user.user.phoneNumber = newPhoneNumber;
    await user.user.save();

    return { message: 'Phone number changed successfully' };
  }

  async checkHasAddress(user, addressId: string): Promise<void> {
    const userAddresses = user.user.addresses;
    let addressExist = false;

    addressExist = await userAddresses.some(
      (address) => address._id.toString() === addressId,
    );

    if (!addressExist) {
      throw new UnauthorizedException('You are not authorized to access this');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }
}
