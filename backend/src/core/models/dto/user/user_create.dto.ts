import { Exclude } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class CreateUserDto extends OmitType(UserDto, ['userid'] as const) {}
