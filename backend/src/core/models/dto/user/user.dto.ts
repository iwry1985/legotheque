import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    userid: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    age: number;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}
