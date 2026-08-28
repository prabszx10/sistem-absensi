import { Controller, Get, Post, Body, Query, UseGuards,Req} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';

@ApiTags('attendance')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController{
    constructor(private readonly AttendanceService: AttendanceService) {}

    @Post()
    @ApiBody({ type: CreateAttendanceDto })
    create(@Body() createAttendanceDto: CreateAttendanceDto,@Req() req: any) {
        const currentUser = req.user;
        return this.AttendanceService.create(createAttendanceDto,currentUser);
    }

    @Get()
    findOne(@Req() req: any){
        const currentUser = req.user;
        return this.AttendanceService.findOne(currentUser);
    }

    @Get('/filter')
    @ApiQuery({ name: 'start_date', required: false, type: String, example: '2026-08-28' })
    @ApiQuery({ name: 'end_date', required: false, type: String, example: '2026-08-28' })
    findByDate(@Query() filterAttendanceDto: FilterAttendanceDto,@Req() req: any){
        const currentUser = req.user;
        return this.AttendanceService.findByDate(filterAttendanceDto,currentUser);
    }
}