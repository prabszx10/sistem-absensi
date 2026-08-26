import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Req} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth} from '@nestjs/swagger';

@ApiTags('employee')
@ApiBearerAuth('jwt-auth')
@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiBody({ type: CreateEmployeeDto })
  create(@Body() createEmployeeDto: CreateEmployeeDto,@Req() req: any) {
    const currentUser = req.user;
    return this.employeeService.create(createEmployeeDto,currentUser);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',    
    type: String,
    example: "id_employee",
  })
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateEmployeeDto })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',    
    type: String,
    example: "id_employee",
  })
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}