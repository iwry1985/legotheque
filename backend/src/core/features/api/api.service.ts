import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BricketCollection } from 'src/core/models/entities/bricksetCollection.entity';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Theme } from 'src/core/models/entities/theme.entity';
import { Repository } from 'typeorm';
import * as striptags from 'striptags';

@Injectable()
export class ApiService {
    private _bricksetHash?: string;
    private readonly _bricksetUrl: string = 'https://brickset.com/api/v3.asmx/';
    private readonly _brickeconomy: string = '';

    constructor(
        @InjectRepository(Legoset)
        private readonly _legosetRepository: Repository<Legoset>,
        @InjectRepository(Theme)
        private readonly _themeRepository: Repository<Theme>,
        @InjectRepository(BricketCollection)
        private readonly _bricksetCollectionRepository: Repository<BricketCollection>
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

    fetchSetsByYear = async (year) => {
        console.log('[API Service] Fetch brickset data...');
        const hash = await this.getBricksetHash();
        const pageSize = 500;
        let pageNumber = 1;
        let hasMore = true;

        while (hasMore) {
            let params = {
                year: year.toString(),
                pageSize: pageSize.toString(),
                pageNumber: pageNumber.toString(),
            };

            const url =
                this._bricksetUrl +
                `getSets?apiKey=${process.env.BRICKSET_API_KEY}&userHash=${hash}&params=${JSON.stringify(params)}`;

            const resp = await fetch(url, {
                method: 'GET',
            });

            const data = await resp.json();
            console.log('[API Service] Matches', data.matches);

            const sets = data.sets ?? [];

            if (sets.length === 0) break; //stop loop

            for (const set of sets) {
                if (
                    set.packagingType === 'Box' &&
                    set.pieces &&
                    set.name !== '{?}'
                ) {
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
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }
            }
            //pagination
            hasMore = sets.length === pageSize;
            pageNumber++;
            console.log('[API Service] hasMore', hasMore, pageNumber);
        }
    };
}
