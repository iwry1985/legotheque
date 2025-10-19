import { Controller, Get, Query } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ApiOperation } from '@nestjs/swagger';
import { ThemeDto } from 'src/core/models/dto/theme/theme.dto';

@Controller('theme')
export class ThemeController {
    constructor(private readonly _themeService: ThemeService) {}

    @Get()
    @ApiOperation({
        summary: 'Retourne tous les thèmes ou seulement ceux spécifiés',
    })
    getThemes(@Query('themeids') themeids?: string): Promise<ThemeDto[]> {
        console.log('[THEME CONTROLLER], getThemes', themeids);
        return this._themeService.getThemes(themeids);
    }
}
