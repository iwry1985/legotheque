import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/core/models/dto/user/login.dto';
import { User } from 'src/core/models/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
        private readonly _jwtService: JwtService
    ) {}

    login = async (login: LoginDto): Promise<string> => {
        const user = await this._userRepository.findOne({
            where: { email: login.email },
        });

        if (!user || !(await bcrypt.compare(login.pwd, user.pwd)))
            throw new UnauthorizedException();

        //TODO: add role to db
        return this._jwtService.sign({
            userid: user.userid,
            username: user.username,
        });
    };
}
