import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Employee } from '../employee/employee.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { EmployeeService } from '../employee/employee.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Employee, Attendance]),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [EmployeeService],
})
export class AttendanceModule { }