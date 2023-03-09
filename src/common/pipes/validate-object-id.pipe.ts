import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateObjectId implements PipeTransform<string, string> {
  transform(value: string): string {
    // Check if the value is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(value)) {
      // If not, throw a BadRequestException with an error message
      throw new BadRequestException('Invalid ObjectId');
    }

    // If it's valid, return the value unaltered
    return value;
  }
}
