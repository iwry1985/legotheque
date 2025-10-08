import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LegothequeService } from './legotheque.service';
import { ApiOperation } from '@nestjs/swagger';
import { LegothequeDto } from 'src/core/models/dto/legotheque/legotheque.dto';
import { CreateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-create.dto';

@Controller('legotheque')
export class LegothequeController {
    constructor(private readonly _legothequeService: LegothequeService) {}

    @Get()
    @ApiOperation({ summary: 'Get all sets from collection' })
    getCollection(): Promise<LegothequeDto[]> {
        return this._legothequeService.getLegotheque(1);
    }

    TODO: 'get userid from req';
    @Get('/:legothequeid')
    @ApiOperation({ summary: 'Get set from user collection' })
    getSetFrom(
        @Param('legothequeid') legothequeid: number
    ): Promise<LegothequeDto | null> {
        return this._legothequeService.getOneSetFromLegotheque(legothequeid);
    }

    @Post()
    @ApiOperation({ summary: 'add set to collection' })
    addSetTo(@Body() body: CreateLegothequeDto): Promise<LegothequeDto> {
        return this._legothequeService.addSetToCollection(body);
    }
}
