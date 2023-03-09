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

  async isUserExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });

    if (user) {
      return true;
    }

    return false;
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, surname, email, password, phoneNumber } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isUserExists = await this.isUserExists(email);

    if (isUserExists) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.userModel.create({
      name,
      email,
      surname,
      phoneNumber,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
