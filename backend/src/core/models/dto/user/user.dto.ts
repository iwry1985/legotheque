import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    IsBoolean,
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
    @Expose()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    userid: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @MinLength(3)
    @MaxLength(150)
    username: string;

    @Expose()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty({ required: true })
    birthdate: Date;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ required: true })
    email: string;

    @Expose()
    @IsOptional()
    @IsNumber()
    age?: number;

    @Expose()
    @IsOptional()
    @IsBoolean()
    admin?: boolean;
}
