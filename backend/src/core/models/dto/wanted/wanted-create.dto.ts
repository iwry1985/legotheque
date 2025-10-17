import { OmitType } from '@nestjs/swagger';
import { WantedDto } from './wanted.dto';

export class CreateWantedDto extends OmitType(WantedDto, [
    'wantedid',
    'wantedat',
    'boughtat',
]) {}
