import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Checks whether a user with the specified email exists in the database
  async isUserExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });

    return !!user;
  }

  // Creates a new user account using the provided sign up data
  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, surname, email, password, phoneNumber } = signUpDto;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if a user with the same email already exists
    const isUserExists = await this.isUserExists(email);

    if (isUserExists) {
      throw new UnauthorizedException('User already exists');
    }

    // Create a new user document in the database
    const user = await this.userModel.create({
      name,
      email,
      surname,
      phoneNumber,
      password: hashedPassword,
    });

    // Generate an access token using the user's ID and return it
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  // Authenticates a user using their email and password and returns an access token
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    // Find a user with the specified email in the database
    const user = await this.userModel.findOne({ email });

    if (!user) {
      // If no user is found, throw an unauthorized exception
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare the provided password with the user's hashed password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      // If the passwords don't match, throw an unauthorized exception
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate an access token using the user's ID and return it
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
