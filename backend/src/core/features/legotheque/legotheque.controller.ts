import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LegothequeService } from './legotheque.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LegothequeDto } from 'src/core/models/dto/legotheque/legotheque.dto';
import { CreateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-create.dto';
import { UpdateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-update.dto';
import { ChangeStatusLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-status.dto';
import { UserGuard } from 'src/core/guards/user.guard';

@UseGuards(UserGuard)
@ApiBearerAuth()
@ApiTags('legotheque')
@Controller('legotheque')
export class LegothequeController {
    constructor(private readonly _legothequeService: LegothequeService) {}

    @Get()
    @ApiOperation({ summary: 'Get all sets from collection' })
    getCollection(): Promise<LegothequeDto[]> {
        return this._legothequeService.getLegotheque(1);
    }

    @Get('/:setid')
    @ApiOperation({ summary: 'Get set from user collection' })
    getSetFrom(
        @Param('setid') setid: number,
        @Req() req: any
    ): Promise<LegothequeDto | null> {
        return this._legothequeService.getOneSetFromLegotheque(
            req.user.userid,
            setid
        );
    }

    @Post()
    @ApiOperation({ summary: 'add set to collection' })
    addSetTo(
        @Body() body: CreateLegothequeDto,
        @Req() req: any
    ): Promise<LegothequeDto> {
        return this._legothequeService.addSetToCollection(
            req.user.userid,
            body
        );
    }

    @Patch('/update/:legothequeid')
    @ApiOperation({ summary: 'update set from collection' })
    updateSet(
        @Param('legothequeid') legothequeid: number,
        @Body() body: UpdateLegothequeDto,
        @Req() req: any
    ): Promise<LegothequeDto> {
        return this._legothequeService.updateCollectionSet(
            legothequeid,
            body,
            req.user.userid
        );
    }

    @Patch('/update/:legothequeid/status')
    @ApiOperation({ summary: 'Change set status from collection' })
    changeSetStatus(
        @Param('legothequeid') legothequeid: number,
        @Body() body: ChangeStatusLegothequeDto,
        @Req() req: any
    ): Promise<LegothequeDto> {
        return this._legothequeService.changeSetStatus(
            legothequeid,
            body,
            req.user.userid
        );
    }

    @Delete('delete/:legothequeid')
    @ApiOperation({ summary: 'Remove set from collection' })
    removeSet(
        @Param('legothequeid') legothequeid: number,
        @Req() req: any
    ): Promise<boolean> {
        return this._legothequeService.removeSetFromCollection(
            legothequeid,
            req.user.userid
        );
    }
}
