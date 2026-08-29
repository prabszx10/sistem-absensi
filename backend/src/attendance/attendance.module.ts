import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Employee } from '../employee/employee.entity';
import { User } from '../users/user.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { EmployeeModule } from '../employee/employee.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Employee, Attendance, User]),
        EmployeeModule,
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule { }