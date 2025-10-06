import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: 'legoset'})
@Unique('UQ_bricksetid', ['bricksetid'])
export class Legoset {
    @PrimaryGeneratedColumn()
    setid: number;

    @Column()
    reference: number;

    @Column()
    variant?: number;

    @Column()
    bricksetid: string;

    @Column()
    name: string;

    @Column()
    year: number;

    @Column()
    category?: string;

    @Column({default: false})
    released: boolean;

    @Column()
    pieces: number;

    @Column()
    launchdate?: Date;

    @Column()
    thumbnail?: string;

    @Column()
    retailprice?: number;

    @Column()
    rating?: number;

    @Column()
    minage?: number;

    @Column()
    tags?: string;

    @Column()
    description?: string;

    @Column()
    height?: number;

    @Column()
    width?: number;

    @Column()
    exitdate?: Date;

    @Column({default: 0})
    minifigs?: number;

    @Column({default: 0})
    reviewcount?: number;

    @Column()
    themeid: number;

    @Column({default: false})
    fetch_brick_economy: boolean;

    @Column({default: new Date()})
    lastupdatedat: Date;
}