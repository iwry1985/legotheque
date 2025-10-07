import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/core/models/dto/user/user.dto';
import { CreateUserDto } from 'src/core/models/dto/user/user_create.dto';
import { ApiOperation } from '@nestjs/swagger';
import { todo } from 'node:test';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Retourne une liste de users' })
    users(): Promise<UserDto[]> {
        return this._userService.getUsers();
    }

    @Get('/:id')
    @ApiOperation({ summary: "Retourner le user correspondant à l'id" })
    user(@Param('id') id: number): Promise<UserDto | null> {
        return this._userService.getUser(id);
    }

    @Post()
    @ApiOperation({ summary: 'Création de compte' })
    create(@Body() body: CreateUserDto): Promise<UserDto> {
        return this._userService.createUser(body);
    }

    TODO: 'only admin or concerned user can suppress account';
    @Delete('/:id')
    @ApiOperation({ summary: 'Suppression de compte' })
    delete(@Param('id') id: number): Promise<boolean> {
        return this._userService.deleteUser(id);
    }
}
