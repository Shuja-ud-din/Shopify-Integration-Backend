import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signIn.dto';
import { SignInInterceptor } from './interceptors/signIn.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @UseInterceptors(SignInInterceptor)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
