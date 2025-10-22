import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LegosetDto } from 'src/core/models/dto/legoset/legoset.dto';
import { GetLegosetFilterDto } from 'src/core/models/dto/legoset/legoset-filters.dto';
import { LegosetListDto } from 'src/core/models/dto/legoset/legoset-list.dto';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
    instanceToInstance,
    instanceToPlain,
    plainToInstance,
} from 'class-transformer';
import { SecondaryMarket } from 'src/core/models/entities/secondary-market.entity';
import { SecondaryMarketDto } from 'src/core/models/dto/legoset/secondary-market.dto';

@Injectable()
export class LegosetService {
    constructor(
        @InjectRepository(Legoset)
        private readonly _legosetRepository: Repository<Legoset>,

        @InjectRepository(SecondaryMarket)
        private readonly _secMarketRepository: Repository<SecondaryMarket>
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
            adultOnly,
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
                '(LOWER(legoset.name) LIKE LOWER(:search) OR legoset.reference::text LIKE :search OR LOWER(legoset.tags) LIKE LOWER(:search))',
                { search: `%${search}%` }
            );

        if (adultOnly) query.andWhere('legoset.minage = 18');

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

        return {
            total,
            page,
            limit,
            pageCount,
            data: instanceToInstance(data),
        };
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

    mappingSecondaryMarket = (rows: SecondaryMarket[]): SecondaryMarketDto => {
        const dto = new SecondaryMarketDto();

        dto.current = { new: {}, used: {} };
        dto.last6Months = { new: {}, used: {} };

        for (const row of rows) {
            const section =
                row.section === 'Last 6 Months Sales'
                    ? 'last6Months'
                    : 'current';
            const condition = row.condition === 'Used' ? 'used' : 'new';

            dto[section][condition] = {
                min:
                    row.min_price != null
                        ? Number(row.min_price).toFixed(2)
                        : undefined,
                max:
                    row.max_price != null
                        ? Number(row.max_price).toFixed(2)
                        : undefined,
                avg:
                    row.avg_price != null
                        ? Number(row.avg_price).toFixed(2)
                        : undefined,
            };
        }

        return dto;
    };

    getSetSecondarMarket = async (
        bricksetid: string
    ): Promise<SecondaryMarketDto | null> => {
        const market = await this._secMarketRepository.find({
            where: { bricksetid },
        });

        if (!market) return null;

        return this.mappingSecondaryMarket(market);
    };
}
