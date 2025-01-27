import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { generateToken } from 'src/common/utils/token';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email: user.email, id: user.id };
    const token = generateToken(payload);

    return token;
  }

  private async validatePassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }
}
