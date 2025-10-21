import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BricksetCollection } from 'src/core/models/entities/brickset-collection.entity';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Theme } from 'src/core/models/entities/theme.entity';
import { Repository } from 'typeorm';
import * as striptags from 'striptags';

@Injectable()
export class ApiService {
    private _bricksetHash?: string;
    private readonly _bricksetUrl: string = 'https://brickset.com/api/v3.asmx/';

    constructor(
        @InjectRepository(Legoset)
        private readonly _legosetRepository: Repository<Legoset>,
        @InjectRepository(Theme)
        private readonly _themeRepository: Repository<Theme>,
        @InjectRepository(BricksetCollection)
        private readonly _bricksetCollectionRepository: Repository<BricksetCollection>
    ) {}

    //****************************** */
    //********** BRICKSET ***********/
    //**************************** */

    private getBricksetHash = async (): Promise<string> => {
        if (!this._bricksetHash) {
            this._bricksetHash = await this.brickset_login();

            if (!this._bricksetHash) throw new Error('No valid Brickset hash');
        }

        return this._bricksetHash;
    };

    private brickset_login = async (): Promise<string | undefined> => {
        console.log('[API Service] Logging in to brickset');

        const resp = await fetch(
            this._bricksetUrl +
                `login?apiKey=${process.env.BRICKSET_API_KEY}&username=${process.env.BRICKSET_USERNAME}&password=${process.env.BRICKSET_PWD}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        if (resp.status === 200) {
            const data: { status: string; hash: string } = await resp.json();

            if (data.status === 'success') return data.hash;
        } else {
            throw new Error('Error login in to brickset');
        }
    };

    fetchSetsByYear = async (year: number) => {
        /**
         * @param year: number year from which fetching begins (from year to 1955)
         * @returns void sets are fetched, transformed into Legoset then stored in db
         */
        console.log('[API Service] Fetch brickset data...');
        const hash = await this.getBricksetHash();
        const pageSize = 500;
        let pageNumber = 1;
        let hasMore = true;
        const toYear = 1950;

        while (hasMore) {
            let params = {
                year: year.toString(),
                pageSize: pageSize.toString(),
                pageNumber: pageNumber.toString(),
                //setNumber: '10342-1',
                extendedData: 1,
            };

            const url =
                this._bricksetUrl +
                `getSets?apiKey=${process.env.BRICKSET_API_KEY}&userHash=${hash}&params=${JSON.stringify(params)}`;

            console.log('[API Service] Calling API...');
            const resp = await fetch(url, {
                method: 'GET',
            });

            const data = await resp.json();
            console.log('data', data, resp);
            console.log(
                '[API Service] Matches',
                data.matches,
                data.sets?.length
            );

            const sets = data.sets ?? [];

            if (sets.length === 0) break; //stop loop

            for (const set of sets) {
                const ref = parseInt(set.number);
                const isNumber = typeof ref == 'number' && !Number.isNaN(ref);

                console.log('REF', ref, isNumber, typeof ref);
                if (
                    isNumber &&
                    set.packagingType === 'Box' &&
                    set.pieces &&
                    set.name !== '{?}'
                    //set.LEGOCom?.US?.retailPrice
                ) {
                    console.log(
                        '[API Service] Set :',
                        set.name,
                        set.number,
                        year
                    );
                    //get theme in db
                    let theme = await this._themeRepository.findOne({
                        where: { name: set.theme },
                    });

                    //if doesn't exist, insert
                    if (!theme) {
                        theme = this._themeRepository.create({
                            name: set.theme,
                        });
                        theme = await this._themeRepository.save(theme);
                    }

                    const cleanDescription = set.extendedData?.description
                        ? striptags(set.extendedData.description)
                        : undefined;

                    //update or create legoset
                    await this._legosetRepository.upsert(
                        {
                            reference: set.number,
                            variant: set.numberVariant,
                            bricksetid: `${set.number}-${set.numberVariant}`,
                            name: set.name,
                            year: set.year,
                            category: set.category,
                            released: set.released ?? false,
                            pieces: set.pieces,
                            launchdate: set.launchDate,
                            thumbnail: set.image?.imageURL,
                            retailprice: set.LEGOCom?.US?.retailPrice,
                            rating: set.rating,
                            minage: set.ageRange?.min,
                            tags: set.extendedData?.tags?.join(', ') ?? null,
                            description: cleanDescription,
                            height: set.dimensions?.height,
                            width: set.dimensions?.width,
                            exitdate: set.exitDate,
                            minifigs: set.minifigs,
                            reviewcount: set.reviewCount,
                            themeid: theme.themeid,
                        },
                        ['bricksetid']
                    );

                    const legoset = await this._legosetRepository.findOneBy({
                        reference: set.number,
                        variant: set.numberVariant,
                    });

                    if (legoset) {
                        await this._bricksetCollectionRepository.upsert(
                            {
                                setid: legoset.setid,
                                ownedby: set.collections?.ownedBy,
                                wantedby: set.collections?.wantedBy,
                            },
                            ['setid']
                        );
                    }

                    //delay
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }

            if (sets.length === pageSize) {
                // encore des pages à parcourir pour cette année
                pageNumber++;
            } else {
                // plus de pages, on passe à l’année suivante
                year--;
                pageNumber = 1;
            }

            // on continue tant qu’on n’a pas dépassé l’année limite
            hasMore = year >= toYear;

            console.log('[API Service] hasMore', hasMore, pageNumber, year);
        }

        console.log('DONE');
    };
}
