import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-create.dto';
import { ChangeStatusLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-status.dto';
import { UpdateLegothequeDto } from 'src/core/models/dto/legotheque/legotheque-update.dto';
import { LegothequeDto } from 'src/core/models/dto/legotheque/legotheque.dto';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Legotheque } from 'src/core/models/entities/legotheque.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class LegothequeService {
    constructor(
        @InjectRepository(Legotheque)
        private readonly _legothequeRepository: Repository<Legotheque>
    ) {}

    //TODO: obj with pagination to return
    getLegotheque = async (userid: number): Promise<LegothequeDto[]> => {
        return this._legothequeRepository.find({ where: { userid } });
    };

    getOneSetFromLegotheque = async (
        legothequeid: number,
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
                legothequeid
            );

            let options: FindOneOptions = { where: { legothequeid } };
            if (!noRelations) options.relations = ['set'];

            return this._legothequeRepository.findOne(options);
        } catch (error) {
            throw new Error(error);
        }
    };

    addSetToCollection = async (
        body: CreateLegothequeDto
    ): Promise<LegothequeDto> => {
        /**
         * @param body: CreateLegothequeDto
         * @returns LegothequeDto
         **/
        try {
            console.log(
                '[LEGOTHEQUE Service] add set to user collection...',
                body
            );
            return await this._legothequeRepository.save({
                ...body,
                set: { setid: body.setid } as Legoset,
            });
        } catch (error) {
            throw new Error(error);
        }
    };

    updateCollectionSet = async (
        legothequeid: number,
        body: UpdateLegothequeDto
    ): Promise<LegothequeDto> => {
        console.log('[LEGOTHEQUE Service] Update... ', body);
        try {
            let lego = await this.getOneSetFromLegotheque(legothequeid, true);

            if (!lego) throw new NotFoundException('Aucun set correspondant');

            lego = { ...lego, ...body };

            return this._legothequeRepository.save(lego);
        } catch (error) {
            throw new Error(error);
        }
    };

    changeSetStatus = async (
        legothequeid: number,
        body: ChangeStatusLegothequeDto
    ): Promise<LegothequeDto> => {
        console.log('[LEGOTHEQUE Service], change status...', body);
        try {
            const { status, date, type } = body;

            const lego = await this.getOneSetFromLegotheque(legothequeid, true);

            if (!lego) throw new NotFoundException('Aucun set correspondant');

            const statusDate: string = `${status}at`;

            lego[status] = type === 'remove' ? false : true;
            lego[statusDate] = type === 'remove' ? null : date || new Date();

            return this._legothequeRepository.save(lego);
        } catch (error) {
            throw new Error(error);
        }
    };

    removeSetFromCollection = async (
        legothequeid: number
    ): Promise<boolean> => {
        console.log(
            '[LEGOTHEQUE Service], remove from legotheque...',
            legothequeid
        );
        try {
            await this._legothequeRepository.delete(legothequeid);

            return true;
        } catch (error) {
            throw new NotFoundException(error);
        }
    };
}
