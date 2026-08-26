import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,DataSource } from 'typeorm';
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

    private readonly dataSource: DataSource,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, currentUser: any): Promise<Employee> {
    const { nama, email, posisi, phoneNo, password } = createEmployeeDto;

    return await this.dataSource.transaction(async (trx) => {
      const userRepository = trx.getRepository(User);
      const employeeRepository = trx.getRepository(Employee);

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email sudah terdaftar sebagai akun user');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = userRepository.create({
        email,
        password: hashedPassword,
        role: 'employee',
      });
  
      const savedUser = await userRepository.save(newUser);
  
      const employee = employeeRepository.create({
        nama,
        email,
        posisi,
        phoneNo,
        userId: savedUser.id,
        createdBy: currentUser.id,
        updatedBy: currentUser.id
      });
  
      return await employeeRepository.save(employee);
    });
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