import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/user.entity';
import { Employee } from './employee/employee.entity';
import { Attendance } from './attendance/attendance.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module'; 
import { AttendanceModule } from './attendance/attendance.module'; 
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Employee, Attendance],
        synchronize: true,
        timezone: 'Asia/Jakarta',
        extra: {
          options: '-c timezone=Asia/Jakarta',
        },
      }),
    }),

    EmployeeModule,
    AuthModule,
    AttendanceModule,
    AuditLogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}