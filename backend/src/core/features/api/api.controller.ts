import { Controller, Get, Param } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api')
export class ApiController {
    constructor(private readonly _apiService: ApiService) {}

    @Get('rebrickable_api/:year')
    @ApiOperation({ summary: 'Récupère les sets sur brickset par année' })
    fetch_brickset(@Param('year') year: number): string {
        this._apiService.fetchSetsByYear(year);
        return 'ok';
    }
}
