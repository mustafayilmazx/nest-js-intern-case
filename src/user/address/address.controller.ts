import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './schemas/address.schema';

@Controller('user/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllAddresses(@Request() req): Promise<Address[]> {
    console.log(req.user);
    return this.addressService.findAll();
  }

  @Get(':id')
  async getAddressById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Address> {
    const address = await this.addressService.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  @Post()
  async createAddress(
    @Body(new ValidationPipe()) createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const created = await this.addressService.create(createAddressDto);
    return created;
  }

  @Put(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const result = await this.addressService.update(id, updateAddressDto);
    if (!result) {
      throw new NotFoundException('Address not found');
    }
    return result;
  }

  @Delete(':id')
  async deleteAddress(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    const result = await this.addressService.delete(id);
    if (!result) {
      throw new NotFoundException('Address not found');
    }
  }
}
