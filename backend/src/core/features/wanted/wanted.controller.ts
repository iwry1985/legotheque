import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
} from '@nestjs/common';
import { WantedService } from './wanted.service';
import { UserGuard } from 'src/core/guards/user.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WantedDto } from 'src/core/models/dto/wanted/wanted.dto';
import { CreateWantedDto } from 'src/core/models/dto/wanted/wanted-create.dto';

@ApiBearerAuth()
@ApiTags('wanted')
@Controller('wanted')
export class WantedController {
    constructor(private readonly _wantedService: WantedService) {}

    @Get(':setid')
    @ApiOperation({ summary: 'Get set from wanted list' })
    getSet(
        @Param('setid') setid: number,
        @Req() req: any
    ): Promise<WantedDto | null> {
        return this._wantedService.getWantedSet(req.user.userid, setid);
    }

    @Post()
    @ApiOperation({ summary: 'add set to wanted list' })
    addSet(@Body() body: CreateWantedDto, @Req() req: any): Promise<WantedDto> {
        console.log('req', req.user);
        return this._wantedService.addToList(req.user.userid, body);
    }

    @Delete(':wantedid')
    @ApiOperation({ summary: 'Remove set from wanted list' })
    removeSet(
        @Param('wantedid') wantedid: number,
        @Req() req: any
    ): Promise<boolean> {
        return this._wantedService.removeFromList(wantedid, req.user.userid);
    }
}
