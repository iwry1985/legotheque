import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/core/models/dto/user/user.dto';
import { CreateUserDto } from 'src/core/models/dto/user/user-create.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { todo } from 'node:test';
import { plainToInstance } from 'class-transformer';
import { UserGuard } from 'src/core/guards/user.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    // @Get()
    // @UseGuards(UserGuard)
    // @ApiBearerAuth()
    // @ApiOperation({ summary: 'Retourne une liste de users' })
    // @ApiResponse({ type: UserDto })
    // users(): Promise<UserDto[]> {
    //     return this._userService.getUsers();
    // }

    @Get()
    @UseGuards(UserGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Retourne le user correspondant à l'id du user connected",
    })
    @ApiResponse({ type: UserDto })
    async user(@Req() req: any): Promise<UserDto | null> {
        const user = await this._userService.getUser(req.user.userid);

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

    @Delete()
    @UseGuards(UserGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Suppression de compte' })
    @ApiResponse({ type: Boolean })
    delete(@Req() req: any): Promise<boolean> {
        return this._userService.deleteUser(req.user.userid);
    }
}
