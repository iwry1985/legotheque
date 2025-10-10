import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LegosetDto } from 'src/core/models/dto/legoset/legoset.dto';
import { GetLegosetFilterDto } from 'src/core/models/dto/legoset/legoset-filters.dto';
import { LegosetListDto } from 'src/core/models/dto/legoset/legoset-list.dto';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class LegosetService {
    constructor(
        @InjectRepository(Legoset)
        private readonly _legosetRepository: Repository<Legoset>
    ) {}

    private addRangeFilter = (
        query: SelectQueryBuilder<Legoset>,
        field: string,
        min?: number,
        max?: number
    ): SelectQueryBuilder<Legoset> => {
        /**
         * @param query: SelectQueryBuilder query that needs new filters
         * @param field: string field to add to query
         * @param min: number min range
         * @param max: number max range
         * @returns SelectQueryBuilder with new filters added
         */
        if (min) query.andWhere(`legoset.${field} >= :min`, { min });

        if (max) query.andWhere(`legoset.${field} <= :max`, { max });

        return query;
    };

    getlist = async (filters: GetLegosetFilterDto): Promise<LegosetListDto> => {
        /**
         * @params filters DTO with filters, search, sort & pagination
         * @returns LegosetListDTO with data, total, page, pageCount & limit
         */
        console.log('[LEGOSET Service] get list');
        const {
            themeid,
            year,
            minPieces,
            maxPieces,
            minAge,
            maxAge,
            sortBy,
            sort,
            search,
        } = filters;
        let { page, limit } = filters;

        let query = this._legosetRepository
            .createQueryBuilder('legoset')
            .leftJoinAndSelect('legoset.theme', 'theme');

        //filter
        if (themeid) query.andWhere('legoset.themeid = :themeid', { themeid });

        if (year) query.andWhere('legoset.year =: year', { year });

        if (minPieces || maxPieces)
            query = this.addRangeFilter(query, 'pieces', minPieces, maxPieces);

        if (minAge || maxAge)
            query = this.addRangeFilter(query, 'minage', minAge, maxAge);

        if (search)
            query.andWhere(
                '(LOWER(legoset.name) LIKE LOWER(:search) OR legoset.reference::text LIKE :search OR LOWER(legoset  .tags) LIKE LOWER(:search))',
                { search: `%${search}%` }
            );

        //pagination
        if (sortBy) {
            query.orderBy(`legoset.${sortBy}`, sort || 'ASC');
        } else {
            query.orderBy('legoset.launchdate', 'DESC');
        }

        if (!page) page = 1;
        if (!limit) limit = 20;
        const offset = (page - 1) * limit;

        query.skip(offset).take(limit);

        const [data, total] = await query.getManyAndCount();
        const pageCount = Math.ceil(total / limit);

        return { total, page, limit, pageCount, data };
    };

    getOne = (id: number): Promise<LegosetDto | null> => {
        /**
         * @param id: number id of set
         * @return set of corresponding id or null if none is found
         */
        console.log('[LEGOSET Service] get set by id ', id);
        return this._legosetRepository.findOne({
            where: { setid: id },
            relations: ['theme'],
        });
    };
}
