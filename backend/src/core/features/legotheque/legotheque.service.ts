import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-create.dto';
import { UpdateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-update.dto';
import { LegothequeDto } from 'src/core/models/dto/legotheque/legotheque.dto';
import { Legotheque } from 'src/core/models/entities/legotheque.entity';
import { Wanted } from 'src/core/models/entities/wanted.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class LegothequeService {
    constructor(
        @InjectRepository(Legotheque)
        private readonly _legothequeRepository: Repository<Legotheque>,

        @InjectRepository(Wanted)
        private readonly _wantedRepository: Repository<Wanted>
    ) {}

    //TODO: obj with pagination to return
    getLegotheque = async (userid: number): Promise<LegothequeDto[]> => {
        return this._legothequeRepository.find({ where: { userid } });
    };

    getOneSetFromLegotheque = async (
        userid: number,
        setid: number,
        noRelations?: boolean
    ): Promise<Legotheque | null> => {
        /**
         * @Param userid: number id of user
         * @Param setid: id of lego set
         * @returns Legotheque line of collection for this user & this set. Null if do no exist
         */

        try {
            console.log(
                '[LEGOTHEQUE Service] get one line from legotheque',
                setid
            );

            let options: FindOneOptions = { where: { setid, userid } };
            if (!noRelations) options.relations = ['set'];

            return this._legothequeRepository.findOne(options);
        } catch (error) {
            throw new Error(error);
        }
    };

    addSetToCollection = async (
        userid: number,
        body: CreateLegothequeDto
    ): Promise<LegothequeDto> => {
        /**
         * @param body: CreateLegothequeDto
         * @returns LegothequeDto
         **/
        try {
            console.log(
                '[LEGOTHEQUE Service] add set to user collection...',
                body,
                userid
            );

            const myLego = await this.getOneSetFromLegotheque(
                userid,
                body.setid
            );

            if (myLego) return myLego;

            body.owned = true;
            body.ownedat = new Date();

            const setAdded = await this._legothequeRepository.save({
                ...body,
                userid,
            });

            //update boughtat in wanted list
            await this._wantedRepository.update(
                {
                    setid: body.setid,
                    userid,
                },
                { boughtat: body.ownedat || new Date() }
            );

            return setAdded;
        } catch (error) {
            throw new Error(error);
        }
    };

    private getSetFromCollectionWithError = async (
        legothequeid: number,
        userid: number
    ): Promise<LegothequeDto> => {
        let lego = await this._legothequeRepository.findOne({
            where: { legothequeid },
        });

        if (!lego) throw new NotFoundException('Aucun set correspondant');

        if (lego.userid !== userid)
            throw new ForbiddenException(
                "Vous n'avez pas le droit de modifier cette collection"
            );

        return lego;
    };

    updateCollectionSet = async (
        legothequeid: number,
        body: UpdateLegothequeDto,
        userid: number
    ): Promise<LegothequeDto> => {
        console.log('[LEGOTHEQUE Service] Update... ', body, legothequeid);
        try {
            let lego = await this.getSetFromCollectionWithError(
                legothequeid,
                userid
            );

            //replace null by false
            const keys = ['built', 'gift', 'fav'];

            keys.forEach((key) => {
                if (!body[key]) body[key] = false;
            });

            lego = { ...lego, ...body };

            if (lego.built && !lego.builtat) lego.builtat = new Date();
            if (lego.builtat && !lego.built) lego.builtat = undefined;

            console.log('LEGO BUILTAT', lego.builtat);

            return this._legothequeRepository.save(lego);
        } catch (error) {
            throw new Error(error);
        }
    };

    removeSetFromCollection = async (
        legothequeid: number,
        userid: number
    ): Promise<boolean> => {
        console.log(
            '[LEGOTHEQUE Service], remove from legotheque...',
            legothequeid
        );
        try {
            await this.getSetFromCollectionWithError(legothequeid, userid);

            await this._legothequeRepository.delete(legothequeid);

            return true;
        } catch (error) {
            throw new NotFoundException(error);
        }
    };
}
