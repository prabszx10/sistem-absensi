import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } 
from 'typeorm';
import { Employee } from '../employee/employee.entity'

export enum AttendanceStatus {
  MASUK = 'MASUK',
  PULANG = 'PULANG',
}

@Entity('attendance')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: true })
    employeeId: string;

    @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @CreateDateColumn({ type: 'timestamptz' })
    attDateTime: Date;

    @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.MASUK })
    status: AttendanceStatus;

    @Column()
    createdBy: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @Column()
    updatedBy: string;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}