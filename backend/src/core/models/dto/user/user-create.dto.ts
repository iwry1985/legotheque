import { Exclude } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto extends OmitType(UserDto, ['userid'] as const) {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @ApiProperty({ required: true })
    pwd: string;
}
