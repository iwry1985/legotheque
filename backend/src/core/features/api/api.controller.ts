import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
    constructor(
        private readonly _apiService: ApiService
    ) {}

    @Get('rebrickable_api')
    fetch_brickset(): string {
        this._apiService.fetchSetsByYear(2025);
        return 'ok';
    }
}
