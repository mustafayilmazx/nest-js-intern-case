import { Transform } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly subStartDate: Date;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly subAddress: Schema.Types.ObjectId;

  constructor(partial?: Partial<CreateSubscriptionDto>) {
    Object.assign(this, partial);
  }
}
