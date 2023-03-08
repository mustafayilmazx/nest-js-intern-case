import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  readonly country: string;

  @IsNotEmpty()
  readonly city: string;

  @IsNotEmpty()
  readonly district: string;

  @IsNotEmpty()
  readonly street: string;

  @IsNotEmpty()
  readonly fullAddress: string;

  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly surname: string;

  @IsNotEmpty()
  readonly zipcode: string;
}
