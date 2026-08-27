import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Attendance } from '../attendance/attendance.entity';
import { Employee } from '../employee/employee.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

export enum AttendanceStatus {
  MASUK = 'MASUK',
  PULANG = 'PULANG',
}

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>,

        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>
    ) { }

    async create(CreateAttendanceDto: CreateAttendanceDto, currentUser: any): Promise<Attendance> {
        const { status } = CreateAttendanceDto;

        const getEmployee = await this.employeeRepository.findOne({where : {userId : currentUser.id}})
        if (!getEmployee) {
            throw new ConflictException('Data Enployee Tidak Ada');
        }

        const newAttendance = this.attendanceRepository.create({
            employeeId : getEmployee.id,
            attDateTime: new Date(),
            status: status as AttendanceStatus,
            createdBy: currentUser.id,
            updatedBy: currentUser.id
        });

        return await this.attendanceRepository.save(newAttendance);
    }

    async findOne(currentUser: any): Promise<any> {

    }
}