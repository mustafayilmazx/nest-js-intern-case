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

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const createdAddress = new this.addressModel(createAddressDto);
    return createdAddress.save();
  }

  async findAll(): Promise<Address[]> {
    return this.addressModel.find().exec();
  }

  async findById(id: string): Promise<Address> {
    return this.addressModel.findById(id).exec();
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressModel
      .findByIdAndUpdate(id, updateAddressDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Address> {
    return this.addressModel.findByIdAndRemove(id).exec();
  }
}
