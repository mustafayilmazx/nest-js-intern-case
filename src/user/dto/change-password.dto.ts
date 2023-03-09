import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  newPassword: string;
}
