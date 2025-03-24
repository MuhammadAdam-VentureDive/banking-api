import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    console.log('email', email);
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      // if (user && await bcrypt.compare(password, user.password)) {
         return user;
      // }
       return null;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  async incrementNotificationCount(userId: string): Promise<void> {
    await this.userRepository.increment({ id: userId }, 'notificationCount', 1);
  }

  async resetNotificationCount(userId: string): Promise<void> {
    await this.userRepository.update({ id: userId }, { notificationCount: 0 });
  }

  async updateWalletBalance(userId: string, walletType: 'gbp' | 'crypto' | 'sn', amount: number): Promise<User> {
    const user = await this.findById(userId);
    
    switch (walletType) {
      case 'gbp':
        user.gbpWalletBalance += amount;
        break;
      case 'crypto':
        user.cryptoBalance += amount;
        break;
      case 'sn':
        user.snTokenBalance += amount;
        break;
    }
    
    return this.userRepository.save(user);
  }
} 