import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Legotheque } from 'src/core/models/entities/legotheque.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LegothequeService {
    constructor(
        @InjectRepository(Legotheque)
        private readonly _legothequeRepository: Repository<Legotheque>
    ) {}

    getOneSetFromLegotheque = async (
        userid: number,
        setid: number
    ): Promise<Legotheque | null> => {
        /**
         * @Param userid: number id of user
         * @Param setid: id of lego set
         * @returns Legotheque line of collection for this user & this set. Null if do no exist
         */
        return this._legothequeRepository.findOne({
            where: { userid, setid },
            relations: ['set'],
        });
    };
}
