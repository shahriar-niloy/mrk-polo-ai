import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class BaseUserDto {
    @IsString()
    @MinLength(2, { message: 'Name should be at least 2 characters' })
    @MaxLength(50, { message: 'Name should not exceed 50 characters' })
    name: string;

    @IsEmail()
    @MaxLength(100, { message: 'Email should not exceed 100 characters' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password should be at least 6 characters' })
    @MaxLength(20, { message: 'Password should not exceed 20 characters' })
    password: string;
}

export class CreateUserDto extends BaseUserDto { }
