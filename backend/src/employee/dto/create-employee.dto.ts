import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'Dicky Prabowo', 
  })
  @IsString()
  @IsNotEmpty({ message: 'Nama wajib diisi' })
  nama: string;

  @ApiProperty({
    example: 'dickyprabowo13@gmail.com', 
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @ApiProperty({
    example: 'Software Engineer', 
  })
  @IsString()
  @IsNotEmpty({ message: 'Posisi wajib diisi' })
  posisi: string;

  @ApiProperty({
    example: '081234567890', 
  })
  @IsString()
  @IsNotEmpty({ message: 'Nomer Handphone wajib diisi' })
  phoneNo: string;

  @ApiProperty({
    example: 'Pass123!', 
  })
  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}