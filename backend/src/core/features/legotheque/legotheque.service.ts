import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-create.dto';
import { UpdateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-update.dto';
import { LegothequeDto } from 'src/core/models/dto/legotheque/legotheque.dto';
import { UserLegothequeDto } from 'src/core/models/dto/legotheque/user-legotheque.dto';
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

    getUserStats = async (userid: number): Promise<UserLegothequeDto> => {
        console.log('[LEGOTHEQUE Service], get user collection...', userid);

        try {
            const collection = await this._legothequeRepository.find({
                where: { userid },
                relations: ['set', 'set.theme'],
            });

            const legotheque = collection.reduce<
                UserLegothequeDto & {
                    _themes: Map<string, number>;
                    lastBoughtDate?: Date;
                    oldestNotBuiltDate?: Date;
                }
            >(
                (acc, c) => {
                    const pieces = c.set?.pieces || 0;
                    acc.totalBricks += pieces;

                    if (c.built) {
                        acc.totalDone++;
                        acc.bricksDone += pieces;
                    } else {
                        acc.bricksLeft += pieces;
                    }

                    const year = c.set?.year;
                    if (year && (!acc.oldestYear || year < acc.oldestYear)) {
                        acc.oldestYear = year;
                        acc.oldestName = c.set.name;
                    }

                    if (
                        pieces &&
                        (!acc.mostBricks || pieces > acc.mostBricks)
                    ) {
                        acc.mostBricks = pieces;
                        acc.mostBricksName = c.set.name;
                    }

                    const theme = c.set?.theme?.name;
                    if (theme) {
                        acc._themes.set(
                            theme,
                            (acc._themes.get(theme) || 0) + 1
                        );
                    }

                    if (c.ownedat) {
                        const ownedDate = new Date(c.ownedat);
                        if (
                            !acc.lastBoughtDate ||
                            ownedDate > acc.lastBoughtDate
                        ) {
                            acc.lastBoughtDate = ownedDate;
                            acc.lastBought = c.set?.name || '';
                        }
                    }

                    if (!c.built && c.ownedat) {
                        const ownedDate = new Date(c.ownedat);
                        if (
                            !acc.oldestNotBuiltDate ||
                            ownedDate < acc.oldestNotBuiltDate
                        ) {
                            acc.oldestNotBuiltDate = ownedDate;
                            acc.oldestNotBuilt = c.set?.name || '';
                        }
                    }

                    if (c.purchaseprice || c.set.retailprice) {
                        const value =
                            Number(c.purchaseprice) ||
                            Number(c.set.retailprice) ||
                            0;
                        acc.estimatedValue += value;
                    }

                    return acc;
                },
                {
                    totalSets: collection.length,
                    totalDone: 0,
                    totalBricks: 0,
                    bricksDone: 0,
                    bricksLeft: 0,
                    totalThemes: 0,
                    mostBricks: 0,
                    oldestYear: 0,
                    mostOwnedTheme: '',
                    oldestNotBuilt: '',
                    lastBought: '',
                    _themes: new Map<string, number>(),
                    lastBoughtDate: undefined,
                    oldestNotBuiltDate: undefined,
                    estimatedValue: 0,
                }
            );

            legotheque.totalThemes = legotheque._themes.size;

            //thème le plus possédé
            const sorted = [...legotheque._themes.entries()].sort(
                (a, b) => b[1] - a[1]
            );
            legotheque.mostOwnedTheme = sorted[0]?.[0] || undefined;

            delete (legotheque as any)._themes;
            delete (legotheque as any).lastBoughtDate;
            delete (legotheque as any).oldestNotBuiltDate;

            return legotheque;
        } catch (error) {
            throw new NotFoundException(error);
        }
    };
}
