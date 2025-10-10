import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/core/models/dto/user/user.dto';
import { CreateUserDto } from 'src/core/models/dto/user/user-create.dto';
import { User } from 'src/core/models/entities/user.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>
    ) {}

    private getAge = (birthdate: Date): number => {
        const age = DateTime.now().diff(
            DateTime.fromJSDate(birthdate),
            'years'
        ).years;

        return Math.floor(age);
    };

    createUser = async (user: CreateUserDto): Promise<UserDto> => {
        /**
         * @param user: CreateUserDto obj user to save
         * @return UserDto new user created
         */
        console.log('[USER Service] create user...', user);

        //check if user exists
        const exists = await this._userRepository.exists({
            where: [{ username: user.username }, { email: user.email }],
        });

        if (exists)
            throw new ConflictException('Email ou username déjà utilisé');
        //BadRequestException
        //UnauthorizedException
        //ForbiddenException

        //hash + sel
        const pwd = await bcrypt.hash(user.pwd, await bcrypt.genSalt());

        const resp = await this._userRepository.save({ ...user, pwd });

        //TODO: envoi email

        return { ...resp, age: this.getAge(user.birthdate) };
    };

    getUsers = async (): Promise<UserDto[]> => {
        /**
         * @returns list of users
         */
        console.log('[USER Service] get user list...');
        return await this._userRepository.find();
    };

    getUser = async (id: number): Promise<UserDto | null> => {
        /**
         * @Param id: number if of user to retrieve
         * @returns user or null if doesn't exist
         */
        console.log('[USER Service] get user...', id);
        const user = await this._userRepository.findOne({
            where: [{ userid: id }],
        });

        return user ? { ...user, age: this.getAge(user.birthdate) } : null;
    };

    deleteUser = async (id: number): Promise<boolean> => {
        /**
         * @param id: number id of user to delete
         * @returns boolean true if delete was a success
         */
        console.log('[USER Service] delete user...', id);
        const deleteU = await this._userRepository.delete({ userid: id });
        console.log('deleteU', deleteU);
        return true;
    };
}
