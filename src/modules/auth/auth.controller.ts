import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { CreateUserDto } from '../user/dto';
import { UserService } from '../user/user.service';
import { Public } from './decorator/public.decorator';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private readonly userService: UserService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
