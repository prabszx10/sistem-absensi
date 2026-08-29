import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity'; // Sesuaikan path entitas
import { Employee } from '../employee/employee.entity';
import { Attendance } from '../attendance/attendance.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employee, Attendance]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}