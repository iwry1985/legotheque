import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LegothequeService } from './legotheque.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LegothequeDto } from 'src/core/models/dto/legotheque/legotheque.dto';
import { CreateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-create.dto';
import { UpdateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-update.dto';
import { UserGuard } from 'src/core/guards/user.guard';
import { UserLegothequeDto } from 'src/core/models/dto/legotheque/user-legotheque.dto';
import { DashboardService } from './dashboard.service';
import { DashboardDto } from 'src/core/models/dto/legotheque/dashboard.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@ApiTags('legotheque')
@Controller('legotheque')
export class LegothequeController {
    constructor(
        private readonly _legothequeService: LegothequeService,
        private readonly _dashboardService: DashboardService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all sets from collection' })
    getCollection(@Req() req: any): Promise<LegothequeDto[]> {
        return this._legothequeService.getLegotheque(req.user.userid);
    }

    @Get('/stats')
    @ApiOperation({ summary: 'Get user stat' })
    getUserStats(@Req() req: any): Promise<UserLegothequeDto> {
        return this._legothequeService.getUserStats(req.user.userid);
    }

    @Get('/dashboard')
    @ApiOperation({ summary: 'user dashboard' })
    getUSerDashboard(
        @Req() req: any,
        @Query('range') range?: 'all' | 'year' | 'month'
    ): Promise<DashboardDto | { message: string }> {
        return this._dashboardService.getDashboard(req.user.userid, range);
    }

    @Get('/:setid')
    @ApiOperation({ summary: 'Get set from user collection' })
    getSetFrom(
        @Param('setid') setid: number,
        @Req() req: any
    ): Promise<LegothequeDto | null> {
        return this._legothequeService.getOneSetFromLegotheque(
            req.user.userid,
            setid,
            true
        );
    }

    @Post()
    @ApiOperation({ summary: 'add set to collection' })
    addSetTo(
        @Body() body: CreateLegothequeDto,
        @Req() req: any
    ): Promise<LegothequeDto> {
        console.log('[Legotheque Controller] Add set', body);
        return this._legothequeService.addSetToCollection(
            req.user.userid,
            body
        );
    }

    @Patch(':legothequeid')
    @ApiOperation({ summary: 'update set from collection' })
    updateSet(
        @Param('legothequeid') legothequeid: number,
        @Body('body') body: UpdateLegothequeDto,
        @Req() req: any
    ): Promise<LegothequeDto> {
        return this._legothequeService.updateCollectionSet(
            legothequeid,
            body,
            req.user.userid
        );
    }

    @Delete(':legothequeid')
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
