import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('employee')
@ApiBearerAuth('jwt-auth')
@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiBody({ type: CreateEmployeeDto })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/employees',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `emp-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Format file harus berupa JPG, JPEG, PNG, atau WEBP'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 50, // Maksimal 2MB
      },
    }),
  )
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Req() req: any,
    @UploadedFile() file?: any,
  ) {
    const currentUser = req.user;
    const photoName = file ? file.filename : null;
    return this.employeeService.create(createEmployeeDto, currentUser, photoName);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id_employee',
  })
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateEmployeeDto })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/employees',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `emp-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Format file harus berupa JPG, JPEG, PNG, atau WEBP'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 50, // Maksimal 2MB
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: any,
  ) {
    const photoName = file ? file.filename : undefined;
    return this.employeeService.update(id, updateEmployeeDto, photoName);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id_employee',
  })
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}