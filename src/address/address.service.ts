import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './schemas/address.schema';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectModel('Address') private readonly addressModel: Model<Address>,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    userObject,
  ): Promise<Address> {
    // create createAddressDto.owner and push it to userObject.addresses
    const payload = { ...createAddressDto, owner: userObject.user._id };
    // create address
    const createdAddress = new this.addressModel(payload, userObject);
    const address = await createdAddress.save();

    // push address to userObject.addresses
    userObject.user.addresses.push(address._id);
    await userObject.user.save();

    return address;
  }

  async findAllAddresses(userObject): Promise<Address[]> {
    return userObject.user.addresses;
  }

  async findAddressById(id: string): Promise<Address> {
    return this.addressModel.findById(id).exec();
  }

  async updateAddress(
    id: string,
    updateAddressDto: UpdateAddressDto,
    userObject,
  ): Promise<Address> {
    // create a new address with the updateAddressDto and push it to userObject.addresses also delete old address
    const payload = { ...updateAddressDto, owner: userObject.user._id };
    const createdAddress = new this.addressModel(payload, userObject);
    const address = await createdAddress.save();

    // find address index in userObject.addresses
    const addressIndex = userObject.user.addresses.findIndex(
      (address) => address._id.toString() === id,
    );

    // replace address in userObject.addresses
    userObject.user.addresses.splice(addressIndex, 1, address._id);
    await userObject.user.save();

    return address;
  }

  async deleteAddress(userObject, id: string): Promise<object> {
    // pop address from userObject.addresses
    const addressIndex = userObject.user.addresses.findIndex(
      (address) => address._id.toString() === id,
    );
    userObject.user.addresses.splice(addressIndex, 1);
    await userObject.user.save();

    return {
      message: 'Address deleted successfully',
    };
  }
}
