import { Expose } from 'class-transformer';
import {
    Column,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity({ name: 'theme' })
export class Theme {
    @Expose()
    @PrimaryGeneratedColumn()
    themeid: number;

    @Expose()
    @Column()
    name: string;

    @Expose()
    @Column()
    img_num: number;
}
