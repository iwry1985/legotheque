import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    minLength,
} from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    userid: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @MinLength(3)
    @MaxLength(150)
    username: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ required: true })
    birthdate: Date;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

    @IsOptional()
    @IsNumber()
    age?: number;
}
