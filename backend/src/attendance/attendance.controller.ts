import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Req} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth} from '@nestjs/swagger';

@ApiTags('attendance')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController{
    constructor(private readonly AttendanceService: AttendanceService) {}

    @Post()
    @ApiBody({ type: CreateAttendanceDto })
    create(@Body() CreateAttendanceDto: CreateAttendanceDto,@Req() req: any) {
        const currentUser = req.user;
        return this.AttendanceService.create(CreateAttendanceDto,currentUser);
    }

    @Get()
    findOne(@Req() req: any){
        const currentUser = req.user;
        return this.AttendanceService.findOne(currentUser);
    }
}