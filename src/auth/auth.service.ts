import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    console.log('email', email);
    const user = await this.userService.validateUser(email, password);
    console.log('sds');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        gbpWalletBalance: user.gbpWalletBalance,
        cryptoBalance: user.cryptoBalance,
        snTokenBalance: user.snTokenBalance,
        notificationCount: user.notificationCount,
      },
    };
  }
} 