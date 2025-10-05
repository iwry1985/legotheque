import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Legoset } from 'src/core/models/entities/legoset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApiService {
    private _bricksetHash?: string;
    private _bricksetUrl: string = 'https://brickset.com/api/v3.asmx/';

    constructor(
        @InjectRepository(Legoset)
        private readonly _legosetRepository: Repository<Legoset>
    ) {
    }

    init_brickset = async(): Promise<void> => {
        this._bricksetHash = await this.brickset_login();

        if(!this._bricksetHash) throw new Error('No valid hash')
    }

    brickset_login = async(): Promise<string | undefined> => {
        console.log('BRICKSET_LOGIN');
        const resp = await fetch(this._bricksetUrl + `login?apiKey=${process.env.BRICKSET_API_KEY}&username=${process.env.BRICKSET_USERNAME}&password=${process.env.BRICKSET_PWD}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        })

        if(resp.status == 200) {
            const data: {status: string, hash: string} = await resp.json();
           
            if(data.status == "success") return data.hash;
        } else {
            throw new Error('Error login in to brickset')
        }
    }

    fetch_brickset_data = async () => {
        //if(!this._bricksetHash) await this.init_brickset();

        const test = await fetch(this._bricksetUrl + `getSets?apiKey=${process.env.BRICKSET_API_KEY}&userHash=quEoK6Wayp&params={'setNumber':'75419-1'}`, {
            method: 'GET'
        });

        if(test.status == 200) {
            const data = await test.json();
            console.log('d', data);

            if(data.status == 'success') console.log('data', data);
        } else {
            throw new Error('Error retrieving sets')
        }
        
    }
}
