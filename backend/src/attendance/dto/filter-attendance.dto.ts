import { IsNotEmpty, IsString,IsEnum  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterAttendanceDto {
    @ApiProperty({
        example: '2026-08-28', 
    })
    @IsNotEmpty({ message: 'Tanggal Mulai Harus Diisi' })
    startDate: string;

    @ApiProperty({
        example: '2026-08-28', 
    })
    @IsNotEmpty({ message: 'Tanggal Selesai Harus Diisi' })
    endDate: string;
}