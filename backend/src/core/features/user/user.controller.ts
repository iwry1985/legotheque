import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/core/models/dto/user/user.dto';
import { CreateUserDto } from 'src/core/models/dto/user/user-create.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { todo } from 'node:test';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Retourne une liste de users' })
    @ApiResponse({ type: UserDto })
    users(): Promise<UserDto[]> {
        return this._userService.getUsers();
    }

    @Get('/:id')
    @ApiOperation({ summary: "Retourner le user correspondant à l'id" })
    @ApiResponse({ type: UserDto })
    async user(@Param('id') id: number): Promise<UserDto | null> {
        const user = await this._userService.getUser(id);

        return plainToInstance(UserDto, user, {
            excludeExtraneousValues: true,
        });
    }

    @Post()
    @ApiOperation({ summary: 'Création de compte' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ type: UserDto })
    create(@Body() body: CreateUserDto): Promise<UserDto> {
        return this._userService.createUser(body);
    }

    TODO: 'only admin or concerned user can suppress account';
    @Delete('/:id')
    @ApiOperation({ summary: 'Suppression de compte' })
    @ApiResponse({ type: Boolean })
    delete(@Param('id') id: number): Promise<boolean> {
        return this._userService.deleteUser(id);
    }
}
