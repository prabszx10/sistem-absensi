import { IsNotEmpty, IsString,IsEnum  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AttendanceStatus {
  MASUK = 'MASUK',
  PULANG = 'PULANG',
}

export class CreateAttendanceDto {
    @ApiProperty({
      example: '13241234123', 
    })
    @IsString()
    @IsNotEmpty({ message: 'Data Employee Tidak Ditemukan' })
    employeeId: string;

    @ApiProperty({
      example: 'MASUK', 
    })
    @IsString()
    @IsNotEmpty({ message: 'Data Status tidak boleh kosong' })
    @IsEnum(AttendanceStatus, { message: 'Status harus berisi MASUK atau PULANG'})
    status: string;
}