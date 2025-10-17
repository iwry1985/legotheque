import {
    IsDate,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class WantedDto {
    @IsNotEmpty()
    @IsInt()
    wantedid: number;

    @IsNotEmpty()
    @IsInt()
    userid: number;

    @IsNotEmpty()
    @IsInt()
    setid: number;

    @IsOptional()
    @IsString()
    priority?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsNotEmpty()
    @IsDate()
    wantedat: Date;

    @IsOptional()
    @IsDate()
    boughtat?: Date;
}
