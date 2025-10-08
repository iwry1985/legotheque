import { OmitType } from '@nestjs/swagger';
import { LegothequeDto } from './legotheque.dto';

export class CreateLegothequeDto extends OmitType(LegothequeDto, [
    'legothequeid',
    'addedat',
    'lastupdatedat',
    'set',
]) {}
