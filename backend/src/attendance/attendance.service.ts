import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Attendance } from '../attendance/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

export enum AttendanceStatus {
  MASUK = 'MASUK',
  PULANG = 'PULANG',
}

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>
    ) { }

    async create(CreateAttendanceDto: CreateAttendanceDto, currentUser: any): Promise<Attendance> {
        const { employeeId, status } = CreateAttendanceDto;

        const newAttendance = this.attendanceRepository.create({
            employeeId,
            attDateTime: new Date(),
            status: status as AttendanceStatus,
            createdBy: currentUser.id,
            updatedBy: currentUser.id
        });

        return await this.attendanceRepository.save(newAttendance);
    }
}