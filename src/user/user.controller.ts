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
import { UserAddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';
import { Address } from 'src/address/schemas/address.schema';
import { ValidateObjectId } from 'src/common/pipes/validate-object-id.pipe';
import { CreateSubscriptionDto } from 'src/subscription/dto/create-subscription.dto';
import { Subscription } from 'src/subscription/schemas/subscription.schema';
import { SubscriptionService } from 'src/subscription/subscription.service';
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
    private readonly addressService: UserAddressService,
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  // User routes

  // Handles POST requests to /user/signup and creates a new user account
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  // Handles POST requests to /user/login and logs a user in
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  // Handles POST requests to /user/change-password and changes a user's password
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

  // Handles POST requests to /user/change-phone-number and changes a user's phone number
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

  // Subscription routes

  // Handles POST requests to /user/create-subscription and creates a new subscription for the user
  @Post('/create-subscription')
  @UseGuards(AuthGuard('jwt'))
  async createSubscription(
    @Body(new ValidationPipe()) createSubscriptionDto: CreateSubscriptionDto,
    @Request() user,
  ): Promise<Subscription> {
    const created = await this.subscriptionService.createSubscription(
      createSubscriptionDto,
      user,
    );
    return created;
  }

  // Address routes

  // Handles GET requests to /user/address and returns all addresses associated with the user's account
  @Get('/address')
  @UseGuards(AuthGuard('jwt'))
  async getAllAddresses(@Request() user): Promise<Address[]> {
    return this.addressService.findAllAddresses(user);
  }

  // Handles GET requests to /user/address/:id and returns the address with the specified ID
  @Get('/address/:id')
  @UseGuards(AuthGuard('jwt'))
  async getAddressById(
    @Param('id', ValidateObjectId) id: string,
    @Request() user,
  ): Promise<Address> {
    await this.userService.checkHasAddress(user, id);

    const address = await this.addressService.findAddressById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  // Handles POST requests to /user/address and creates a new address associated with the user's account
  @Post('/address')
  @UseGuards(AuthGuard('jwt'))
  async createAddress(
    @Body(new ValidationPipe()) createAddressDto: CreateAddressDto,
    @Request() user,
  ): Promise<Address> {
    const created = await this.addressService.createAddress(
      createAddressDto,
      user,
    );
    return created;
  }

  // Handles PUT requests to /user/address/:id and updates the address with the specified ID
  @Put('/address/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateAddress(
    @Param('id', ValidateObjectId) id: string,
    @Body(new ValidationPipe()) updateAddressDto: UpdateAddressDto,
    @Request() user,
  ): Promise<Address> {
    await this.userService.checkHasAddress(user, id);

    const result = await this.addressService.updateAddress(
      id,
      updateAddressDto,
      user,
    );
    if (!result) {
      throw new NotFoundException('Address not found');
    }
    return result;
  }

  // Handles DELETE requests to /user/address/:id and deletes the address with the specified ID
  @Delete('/address/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteAddress(
    @Param('id', ValidateObjectId) id: string,
    @Request() user,
  ): Promise<object> {
    await this.userService.checkHasAddress(user, id);
    const result = await this.addressService.deleteAddress(user, id);

    if (!result) {
      throw new NotFoundException('Address not found');
    }
    return {
      message: 'Address deleted successfully',
    };
  }
}
