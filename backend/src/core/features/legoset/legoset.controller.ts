import { Controller, Get, Param, Query } from '@nestjs/common';
import { LegosetService } from './legoset.service';
import { LegosetDto } from 'src/core/models/dto/legoset/legoset.dto';
import { GetLegosetFilterDto } from 'src/core/models/dto/legoset/legoset-filters.dto';
import { UseFilters } from '@nestjs/common';
import { LegosetListDto } from 'src/core/models/dto/legoset/legoset-list.dto';
import {
    ApiOperation,
    ApiProduces,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Legoset } from 'src/core/models/entities/legoset.entity';

@Controller('legoset')
export class LegosetController {
    constructor(private readonly _legosetService: LegosetService) {}

    @Get()
    @ApiOperation({
        summary: 'Retourne les sets avec filtres optionnels',
    })
    @ApiResponse({ type: LegosetListDto })
    getList(@Query() filters: GetLegosetFilterDto): Promise<LegosetListDto> {
        return this._legosetService.getlist(filters);
    }

    @Get('/:id')
    @ApiOperation({ summary: "Retourne le set correspondant à l'id" })
    @ApiResponse({ type: LegosetDto })
    async getOne(@Param('id') id: number): Promise<LegosetDto | null> {
        const legoset = await this._legosetService.getOne(id);
        return plainToInstance(LegosetDto, legoset, {
            excludeExtraneousValues: true,
        });
    }
}
