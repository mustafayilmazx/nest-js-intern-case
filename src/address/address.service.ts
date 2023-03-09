import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './schemas/address.schema';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel('Address') private readonly addressModel: Model<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto, user): Promise<Address> {
    // create createAddressDto.owner and push it to user.user.addresses
    const payload = { ...createAddressDto, owner: user.user._id };
    // create address
    const createdAddress = new this.addressModel(payload, user);
    const address = await createdAddress.save();

    // push address to user.user.addresses
    user.user.addresses.push(address._id);
    await user.user.save();

    return address;
  }

  async findAll(user): Promise<Address[]> {
    return user.user.addresses;
  }

  async findById(id: string): Promise<Address> {
    return this.addressModel.findById(id).exec();
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
    user,
  ): Promise<Address> {
    // create a new address with the updateAddressDto and push it to user.user.addresses also delete old address
    const payload = { ...updateAddressDto, owner: user.user._id };
    const createdAddress = new this.addressModel(payload, user);
    const address = await createdAddress.save();

    // find address index in user.user.addresses
    const addressIndex = user.user.addresses.findIndex(
      (address) => address._id.toString() === id,
    );

    // replace address in user.user.addresses
    user.user.addresses.splice(addressIndex, 1, address._id);
    await user.user.save();

    return address;
  }

  async delete(user, id: string): Promise<object> {
    // pop address from user.user.addresses
    const addressIndex = user.user.addresses.findIndex(
      (address) => address._id.toString() === id,
    );
    user.user.addresses.splice(addressIndex, 1);
    await user.user.save();

    return {
      message: 'Address deleted successfully',
    };
  }
}
