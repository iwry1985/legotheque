import {
    Column,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity({ name: 'theme' })
export class Theme {
    @PrimaryGeneratedColumn()
    themeid: number;

    @Column()
    name: string;
}
