import { OmitType } from '@nestjs/swagger';
import { WantedDto } from './wanted.dto';

export class CreateWantedDto extends OmitType(WantedDto, [
    'userid',
    'wantedid',
    'wantedat',
    'boughtat',
]) {}
