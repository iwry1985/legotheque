import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetLegosetFilterDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    @ApiProperty({ name: 'themeid', required: false })
    themeid?: number;

    @IsOptional()
    @IsInt()
    @Min(1955)
    @Type(() => Number)
    @ApiProperty({ name: 'year', required: false })
    year?: number;

    // @IsOptional()
    // @IsString()
    // @ApiProperty()
    // name?: string;

    // @IsOptional()
    // @IsInt()
    // @ApiProperty()
    // reference?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    @ApiProperty({ name: 'minPieces', required: false })
    minPieces?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    @ApiProperty({ name: 'maxPieces', required: false })
    maxPieces?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(4)
    @ApiProperty({ name: 'minAge', required: false })
    minAge?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(4)
    @ApiProperty({ name: 'maxAge', required: false })
    maxAge?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ name: 'search', required: false })
    search?: string;

    //pagination
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(50)
    @ApiProperty({ name: 'limit', required: false })
    limit?: number = 20;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @ApiProperty({ name: 'page', required: false })
    page?: number = 1;

    @IsOptional()
    @IsString()
    @IsIn([
        'name',
        'year',
        'pieces',
        'rating',
        'minage',
        'reference',
        'theme.name',
        'launchdate',
        'exitdate',
    ])
    @ApiProperty({ name: 'sortBy', required: false })
    sortBy?: string;

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    @ApiProperty({ name: 'sort', required: false })
    sort?: 'ASC' | 'DESC';
}
