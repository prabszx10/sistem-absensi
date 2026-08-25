import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUser();
  }

  private async seedUser() {
    const count = await this.userRepository.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const defaultUser = this.userRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      await this.userRepository.save(defaultUser);
      this.logger.log('✅ Seeder Success: Default user created (admin@example.com / admin123)');
    }
  }
}