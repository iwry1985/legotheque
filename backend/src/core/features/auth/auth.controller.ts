import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/core/models/dto/user/login.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post()
    @ApiBody({ type: LoginDto })
    @ApiBearerAuth()
    async login(@Body() login: LoginDto): Promise<string> {
        return this._authService.login(login);
    }
}
