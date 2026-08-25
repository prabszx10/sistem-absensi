import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Employee } from './employee.entity';
import { User } from '../users/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { nama, email, posisi, password } = createEmployeeDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar sebagai akun user');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role: 'employee',
    });
    const savedUser = await this.userRepository.save(newUser);

    const employee = this.employeeRepository.create({
      nama,
      email,
      posisi,
      userId: savedUser.id,
    });

    return await this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      relations: {
      user: true,
    },
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: {
      user: true,
    },
    });

    if (!employee) {
      throw new NotFoundException(`Employee dengan ID "${id}" tidak ditemukan`);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<{ message: string }> {
    const employee = await this.findOne(id);

    await this.employeeRepository.remove(employee);

    if (employee.userId) {
      await this.userRepository.delete(employee.userId);
    }

    return { message: `Employee ${employee.nama} beserta akun usernya berhasil dihapus` };
  }
}