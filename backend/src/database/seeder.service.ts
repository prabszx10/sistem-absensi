import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Employee } from '../employee/employee.entity';
import { Attendance, AttendanceStatus } from '../attendance/attendance.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      this.logger.log('ℹ️ Database already seeded. Skipping...');
      return;
    }

    this.logger.log('🌱 Starting database seeding...');

    // 1. Password Hashes
    const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
    const userPasswordHash = await bcrypt.hash('Pass123!', 10);

    // 2. Seed Admin User (Standalone)
    const adminUser = this.userRepository.create({
      email: 'admin@company.com',
      password: adminPasswordHash,
      role: 'admin',
    });
    const savedAdmin = await this.userRepository.save(adminUser);
    this.logger.log('✅ Admin user created: admin@company.com');

    // Data Mock Dummy 5 Karyawan
    const dummyEmployeesData = [
      { nama: 'Dicky Prabowo Octianto', email: 'dicky@company.com', posisi: 'Software Engineer', phoneNo: '081234567891' },
      { nama: 'Siti Aminah', email: 'siti@company.com', posisi: 'UI/UX Designer', phoneNo: '081234567892' },
      { nama: 'Budi Santoso', email: 'budi@company.com', posisi: 'Backend Developer', phoneNo: '081234567893' },
      { nama: 'Dewi Lestari', email: 'dewi@company.com', posisi: 'QA Engineer', phoneNo: '081234567894' },
      { nama: 'Rian Ardianto', email: 'rian@company.com', posisi: 'DevOps Engineer', phoneNo: '081234567895' },
    ];

    // 3. Loop Seed 5 User, 5 Employee, & Attendance Data
    for (const empData of dummyEmployeesData) {
      // Create User
      const user = this.userRepository.create({
        email: empData.email,
        password: userPasswordHash,
        role: 'user',
      });
      const savedUser = await this.userRepository.save(user);

      // Create Employee
      const employee = this.employeeRepository.create({
        nama: empData.nama,
        email: empData.email,
        posisi: empData.posisi,
        phoneNo: empData.phoneNo,
        userId: savedUser.id,
        user: savedUser,
        createdBy: savedAdmin.id,
        updatedBy: savedAdmin.id,
      });
      const savedEmployee = await this.employeeRepository.save(employee);

      // Create Attendance records (1-29 Agustus 2026)
      const attendancesToSeed = this.generateRandomAttendances(savedEmployee, savedAdmin.id);
      await this.attendanceRepository.save(attendancesToSeed);
    }

    this.logger.log('🎉 Seeding completed successfully!');
  }

  // Helper untuk generate data attendance realistis (Ada Masuk, Pulang, & Lupa Absen Pulang)
  private generateRandomAttendances(employee: Employee, adminId: string): Attendance[] {
    const attendances: Attendance[] = [];

    // Pilih 4 - 6 hari kerja acak antara tanggal 1-29 Agustus 2026
    const totalDays = Math.floor(Math.random() * 3) + 4; 
    const selectedDays = new Set<number>();
    
    while (selectedDays.size < totalDays) {
      const randomDay = Math.floor(Math.random() * 29) + 1;
      selectedDays.add(randomDay);
    }

    const sortedDays = Array.from(selectedDays).sort((a, b) => a - b);

    // Tentukan 1 hari acak dari hari yang terpilih untuk simulasi "Lupa Absen Pulang"
    const dayForgotCheckout = sortedDays[Math.floor(Math.random() * sortedDays.length)];

    for (const day of sortedDays) {
      // 1. Absen MASUK (Jam 07:45 - 08:30)
      const inHour = 7;
      const inMinute = Math.floor(Math.random() * 45) + 15; // 07:15 - 08:00
      const inTime = new Date(2026, 7, day, inHour, inMinute, 0);

      attendances.push(
        this.attendanceRepository.create({
          employeeId: employee.id,
          employee: employee,
          attDateTime: inTime,
          status: AttendanceStatus.MASUK,
          createdBy: adminId,
          updatedBy: adminId,
        })
      );

      // 2. Absen PULANG (Jam 17:00 - 18:15)
      // Jika hari ini BUKAN hari "lupa absen pulang", maka tambahkan record PULANG
      if (day !== dayForgotCheckout) {
        const outHour = 17;
        const outMinute = Math.floor(Math.random() * 60); // 17:00 - 17:59
        const outTime = new Date(2026, 7, day, outHour, outMinute, 0);

        attendances.push(
          this.attendanceRepository.create({
            employeeId: employee.id,
            employee: employee,
            attDateTime: outTime,
            status: AttendanceStatus.PULANG,
            createdBy: adminId,
            updatedBy: adminId,
          })
        );
      }
    }

    return attendances;
  }
}