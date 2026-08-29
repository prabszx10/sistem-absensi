import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { User } from '../users/user.entity';
import { Employee } from '../employee/employee.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Employee]),
    JwtModule.register({
      global: true,
      secret: 'dickyprabowo2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Export jika butuh dipanggil modul lain
})
export class AuthModule {}