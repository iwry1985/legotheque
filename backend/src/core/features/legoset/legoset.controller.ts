import { Controller, Get, Param, Query } from '@nestjs/common';
import { LegosetService } from './legoset.service';
import { LegosetDto } from 'src/core/models/dto/legoset/legoset.dto';
import { GetLegosetFilterDto } from 'src/core/models/dto/legoset/legoset-filters.dto';
import { UseFilters } from '@nestjs/common';
import { LegosetListDto } from 'src/core/models/dto/legoset/legoset-list.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('legoset')
export class LegosetController {
    constructor(private readonly _legosetService: LegosetService) {}

    @Get()
    @ApiOperation({
        summary: 'Retourne les sets avec filtres optionnels',
    })
    getList(@Query() filters: GetLegosetFilterDto): Promise<LegosetListDto> {
        return this._legosetService.getlist(filters);
    }

    @Get('/:id')
    @ApiOperation({ summary: "Retourne le set correspondant à l'id" })
    getOne(@Param('id') id: number): Promise<LegosetDto | null> {
        return this._legosetService.getOne(id);
    }
}
