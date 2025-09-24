import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Password should contain more than 5 characters' })
  @MaxLength(100, { message: 'Password should be Max 100 characters' })
  password: string;
}