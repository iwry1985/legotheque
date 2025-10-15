import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/core/models/dto/user/login.dto';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('login')
    @ApiBody({ type: LoginDto })
    @ApiBearerAuth()
    async login(@Body() login: LoginDto): Promise<{ token: string }> {
        return { token: await this._authService.login(login) };
    }

    @ApiQuery({ name: 'token', type: String })
    @Get('refresh')
    async refresh(@Query('token') token: string): Promise<{ token: string }> {
        return { token: await this._authService.refresh(token) };
    }
}
