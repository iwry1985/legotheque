import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLegothequeDto } from './legotheque-create.dto';

//exclude fields we don't want to be updated
class BaseUpdateLegothqueDto extends OmitType(CreateLegothequeDto, [
    'setid',
    'owned',
    'ownedat',
    'wanted',
    'wantedat',
    'built',
    'builtat',
] as const) {}

//put every fields as optionals
export class UpdateLegothequeDto extends BaseUpdateLegothqueDto {}
