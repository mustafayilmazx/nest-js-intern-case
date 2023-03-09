import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';
import { Address } from 'src/address/schemas/address.schema';
import { ValidateObjectId } from 'src/common/pipes/validate-object-id.pipe';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { SignUpDto } from '../auth/dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePhoneNumberDto } from './dto/change-phone-number.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly authService: AuthService,
  ) {}

  // user routes
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('/change-password')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() user,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(
      user,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('/change-phone-number')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async changePhoneNumber(
    @Body() changePhoneNumberDto: ChangePhoneNumberDto,
    @Request() user,
  ): Promise<{ message: string }> {
    return this.userService.changePhoneNumber(
      user,
      changePhoneNumberDto.newPhoneNumber,
    );
  }

  // address routes

  @Get('/address')
  @UseGuards(AuthGuard('jwt'))
  async getAllAddresses(@Request() user): Promise<Address[]> {
    return this.addressService.findAll(user);
  }

  @Get('/address/:id')
  @UseGuards(AuthGuard('jwt'))
  async getAddressById(
    @Param('id', ValidateObjectId) id: string,
    @Request() user,
  ): Promise<Address> {
    await this.userService.checkHasAddress(user, id);

    const address = await this.addressService.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  @Post('/address')
  @UseGuards(AuthGuard('jwt'))
  async createAddress(
    @Body(new ValidationPipe()) createAddressDto: CreateAddressDto,
    @Request() user,
  ): Promise<Address> {
    const created = await this.addressService.create(createAddressDto, user);
    return created;
  }

  @Put('/address/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateAddress(
    @Param('id', ValidateObjectId) id: string,
    @Body(new ValidationPipe()) updateAddressDto: UpdateAddressDto,
    @Request() user,
  ): Promise<Address> {
    await this.userService.checkHasAddress(user, id);

    const result = await this.addressService.update(id, updateAddressDto, user);
    if (!result) {
      throw new NotFoundException('Address not found');
    }
    return result;
  }

  @Delete('/address/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteAddress(
    @Param('id', ValidateObjectId) id: string,
    @Request() user,
  ): Promise<object> {
    await this.userService.checkHasAddress(user, id);
    const result = await this.addressService.delete(user, id);

    if (!result) {
      throw new NotFoundException('Address not found');
    }
    return {
      message: 'Address deleted successfully',
    };
  }
}
