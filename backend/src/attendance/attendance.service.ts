import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Raw } from 'typeorm';

import { Attendance } from '../attendance/attendance.entity';
import { Employee } from '../employee/employee.entity';
import { User } from '../users/user.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';

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
        private readonly employeeRepository: Repository<Employee>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly dataSource: DataSource,
    ) { }

    async create(CreateAttendanceDto: CreateAttendanceDto, currentUser: any): Promise<Attendance> {
        const { status } = CreateAttendanceDto;

        return await this.dataSource.transaction(async (trx) => {
            const attendanceRepository = trx.getRepository(Attendance);
            const employeeRepository = trx.getRepository(Employee);
            const attDate = new Date();

            const getEmployee = await employeeRepository.findOne({where : {userId : currentUser.id}})
            if (!getEmployee) { throw new ConflictException('Data Karyawan Tidak Ada'); }

            const newAttendance = attendanceRepository.create({
                employeeId : getEmployee.id,
                attDateTime: attDate,
                status: status as AttendanceStatus,
                createdBy: currentUser.id,
                updatedBy: currentUser.id
            });

            return await attendanceRepository.save(newAttendance);
        });
    }

    async findOne(currentUser: any): Promise<any> {
        const getEmployee = await this.employeeRepository.findOne({ 
            where: { userId: currentUser.id } 
        });
        
        if (!getEmployee) {
            throw new NotFoundException('Data Karyawan Tidak Ditemukan');
        }

        const summary = await this.attendanceRepository
            .createQueryBuilder('attendance')
            .select('attendance.employeeId', 'employeeId')
            .addSelect('DATE(attendance.attDateTime)', 'date')
            .addSelect(`MIN(CASE WHEN attendance.status = 'MASUK' THEN attendance.attDateTime END)::TIME`, 'timeIn')
            .addSelect(`MAX(CASE WHEN attendance.status = 'PULANG' THEN attendance.attDateTime END)::TIME`, 'timeOut')
            .where('attendance.employeeId = :employeeId', { employeeId: getEmployee.id })
            .andWhere(`DATE(attendance.attDateTime - INTERVAL '3 hours') = CURRENT_DATE`)
            .groupBy('attendance.employeeId')
            .addGroupBy('DATE(attendance.attDateTime)')
            .getRawOne();

        return {
            employeeId: getEmployee.id,
            date: summary?.date ? new Date(summary.date).toLocaleDateString('sv-SE') : new Date().toLocaleDateString('sv-SE'),
            timeIn: summary?.timeIn,
            timeOut: summary?.timeOut,
        };
    }

    async findByDate(FilterAttendanceDto:FilterAttendanceDto,currentUser: any){
        const { startDate,endDate } = FilterAttendanceDto;

        const getUser = await this.userRepository.findOne({
            where: { id: currentUser.id }
        })

        if(getUser?.role != 'admin'){
            const getEmployee = await this.employeeRepository.findOne({ 
                where: { userId: currentUser.id },
                relations: { user: true },
            });

            if (!getEmployee) {
                throw new NotFoundException('Data karyawan tidak ditemukan');
            }
        }
        

        const getData = this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoin('attendance.employee', 'employee')
        .leftJoin('employee.user', 'user')
        .select('attendance.employeeId', 'employeeId')
        .addSelect('employee.nama', 'nama')
        .addSelect('user.email', 'email')
        .addSelect(`DATE("attendance"."attDateTime" - interval '3 hours')`, 'date')
        .addSelect(`MIN(CASE WHEN attendance.status = 'MASUK' THEN attendance.attDateTime END)`, 'timeIn')
        .addSelect(`MAX(CASE WHEN attendance.status = 'PULANG' THEN attendance.attDateTime END)`, 'timeOut')
        .where(`DATE("attendance"."attDateTime" - interval '3 hours') BETWEEN :startDate AND :endDate`, {startDate,endDate})
        

        if(getUser?.role != 'admin'){
            const getEmployee = await this.employeeRepository.findOne({ 
                where: { userId: currentUser.id },
                relations: { user: true },
            });

            getData.andWhere('attendance.employeeId = :employeeId', { employeeId: getEmployee?.id })
        }

        return await getData.groupBy('attendance.employeeId')
        .addGroupBy('employee.nama')
        .addGroupBy('user.email') 
        .addGroupBy(`DATE("attendance"."attDateTime" - interval '3 hours')`)
        .orderBy('employee.nama').getRawMany();
    }
}