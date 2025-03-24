import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the user',
    type: User 
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }
  
  /*
  @Get(':id/notifications/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notification count' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the notification count',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  async getNotificationCount(@Param('id') id: string): Promise<{ count: number }> {
    const user = await this.userService.findById(id);
    return { count: user.notificationCount };
  }

  @Get(':id/reset-notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset user notification count' })
  @ApiResponse({ 
    status: 200, 
    description: 'Notification count reset to zero',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async resetNotifications(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.resetNotificationCount(id);
    return { message: 'Notification count reset' };
  }
  */
} 