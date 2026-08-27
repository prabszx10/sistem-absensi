import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Employee } from '../employee/employee.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const employee = await this.employeeRepository.findOne({ where: { "userId": user.id} });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: 'dickypraboowo2026',
      expiresIn: '1d',
    });

    return {
      message: 'Login berhasil',
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: employee?.nama,
      },
    };
  }
}