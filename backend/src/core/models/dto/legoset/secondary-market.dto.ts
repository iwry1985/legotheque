import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDecimal,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

class PriceRangeDto {
    @IsOptional()
    @ApiProperty()
    @Transform(({ value }) =>
        value != null ? Number(value).toFixed(2) : undefined
    )
    min?: string;

    @IsOptional()
    @ApiProperty()
    @Transform(({ value }) =>
        value != null ? Number(value).toFixed(2) : undefined
    )
    max?: string;

    @IsOptional()
    @ApiProperty()
    @Transform(({ value }) =>
        value != null ? Number(value).toFixed(2) : undefined
    )
    avg?: string;
}

class ConditionDto {
    @IsNotEmpty()
    @ApiProperty()
    new: PriceRangeDto;

    @IsNotEmpty()
    @ApiProperty()
    used: PriceRangeDto;
}

export class SecondaryMarketDto {
    @IsNotEmpty()
    current: ConditionDto;

    @IsNotEmpty()
    last6Months: ConditionDto;
}
