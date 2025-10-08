import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { LegothequeService } from './legotheque.service';
import { ApiOperation } from '@nestjs/swagger';
import { LegothequeDto } from 'src/core/models/dto/legotheque/legotheque.dto';
import { CreateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-create.dto';
import { UpdateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-update.dto';
import { ChangeStatusLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-status.dto';

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

    @Patch('/update/:legothequeid')
    @ApiOperation({ summary: 'update set from collection' })
    updateSet(
        @Param('legothequeid') legothequeid: number,
        @Body() body: UpdateLegothequeDto
    ): Promise<LegothequeDto> {
        return this._legothequeService.updateCollectionSet(legothequeid, body);
    }

    @Patch('/update/:legothequeid/status')
    @ApiOperation({ summary: 'Change set status from collection' })
    changeSetStatus(
        @Param('legothequeid') legothequeid: number,
        @Body() body: ChangeStatusLegothequeDto
    ): Promise<LegothequeDto> {
        return this._legothequeService.changeSetStatus(legothequeid, body);
    }

    @Delete('delete/:legothequeid')
    @ApiOperation({ summary: 'Remove set from collection' })
    removeSet(@Param('legothequeid') legothequeid: number): Promise<boolean> {
        return this._legothequeService.removeSetFromCollection(legothequeid);
    }
}
