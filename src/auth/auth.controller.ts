import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        user: { 
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            fullName: { type: 'string' },
            gbpWalletBalance: { type: 'number' },
            cryptoBalance: { type: 'number' },
            snTokenBalance: { type: 'number' },
            notificationCount: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('loginDto', loginDto);
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      console.log('user', user);
      return this.authService.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
} 