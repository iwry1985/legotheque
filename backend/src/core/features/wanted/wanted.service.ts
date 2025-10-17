import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWantedDto } from 'src/core/models/dto/wanted/wanted-create.dto';
import { WantedDto } from 'src/core/models/dto/wanted/wanted.dto';
import { Wanted } from 'src/core/models/entities/wanted.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WantedService {
    constructor(
        @InjectRepository(Wanted)
        private readonly _wantedRepository: Repository<Wanted>
    ) {}

    private getSetFromList = async (
        wantedid: number,
        userid: number
    ): Promise<WantedDto> => {
        let lego = await this._wantedRepository.findOne({
            where: { wantedid },
        });

        if (!lego) throw new NotFoundException('Aucun set correspondant');

        if (lego.userid !== userid)
            throw new ForbiddenException(
                "Vous n'avez pas le droit de modifier cette collection"
            );

        return lego;
    };

    getWantedSet = async (
        userid: number,
        setid: number
    ): Promise<WantedDto | null> => {
        console.log('[WANTED SERVICE], get one line', setid, userid);

        return this._wantedRepository.findOne({ where: { userid, setid } });
    };

    addToList = async (
        userid: number,
        body: CreateWantedDto
    ): Promise<WantedDto> => {
        console.log('[WANTED SERVICE], add to list', body, userid);

        const inList: WantedDto | null = await this._wantedRepository.findOne({
            where: { userid, setid: body.setid },
        });

        if (inList) return inList;

        return await this._wantedRepository.save({
            ...body,
            userid,
        });
    };

    removeFromList = async (
        wantedid: number,
        userid: number
    ): Promise<boolean> => {
        console.log('[WANTED SERVICE], remove from list', wantedid, userid);

        try {
            await this.getSetFromList(wantedid, userid);

            await this._wantedRepository.delete(wantedid);

            return true;
        } catch (err) {
            console.error('[ERR WANTED SERVICE, remove]', err);
            throw new NotFoundException(err);
        }
    };
}
