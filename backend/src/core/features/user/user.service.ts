import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/core/models/dto/user/user.dto';
import { CreateUserDto } from 'src/core/models/dto/user/user-create.dto';
import { User } from 'src/core/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>
    ) {}

    createUser = async (user: CreateUserDto): Promise<UserDto> => {
        /**
         * @param user: CreateUserDto obj user to save
         * @return UserDto new user created
         */
        console.log('[USER Service] create user...', user);

        return await this._userRepository.save(user);
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
        return await this._userRepository.findOne({
            where: [{ userid: id }],
        });
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
