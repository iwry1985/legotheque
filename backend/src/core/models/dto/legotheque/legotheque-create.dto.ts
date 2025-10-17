import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LegothequeDto } from './legotheque.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateLegothequeDto extends OmitType(LegothequeDto, [
    'legothequeid',
    'userid',
    'addedat',
    'lastupdatedat',
    'set',
]) {}
