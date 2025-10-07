import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ThemeDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    themeid: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;
}
