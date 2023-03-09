import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ChangePhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('TR')
  newPhoneNumber: string;
}
