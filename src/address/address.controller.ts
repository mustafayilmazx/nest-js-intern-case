import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './schemas/address.schema';

@Controller('user/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

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

  // @Put(':id')
  // async updateAddress(
  //   @Param('id') id: string,
  //   @Body(new ValidationPipe()) updateAddressDto: UpdateAddressDto,
  // ): Promise<Address> {
  //   const result = await this.addressService.update(id, updateAddressDto);
  //   if (!result) {
  //     throw new NotFoundException('Address not found');
  //   }
  //   return result;
  // }
}
