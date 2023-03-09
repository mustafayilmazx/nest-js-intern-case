import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    // Set options for the JWT strategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload) {
    // Extract user ID from the JWT payload
    const { id } = payload;

    // Find the user with the given ID and populate their addresses and subscriptions fields
    const user = await this.userModel
      .findById(id)
      .populate('addresses')
      .populate('subscriptions')
      .exec();

    // If no user is found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    // Otherwise, return the user object
    return user;
  }
}
