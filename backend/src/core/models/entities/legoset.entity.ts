import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'legoset'})
export class Legoset {
    @PrimaryColumn()
    setid: number;

    @Column()
    reference: number;

    @Column()
    variant?: number;

    @Column()
    name: string;

    @Column()
    year: number;

    @Column()
    category?: string;

    @Column()
    released: boolean;

    @Column()
    pieces: number;

    @Column()
    launchDate?: Date;

    @Column()
    thumbnail?: string;

    @Column()
    price?: number;

    @Column()
    rating?: number;

    @Column()
    minAge?: number;

    @Column()
    tags?: string;

    @Column()
    description?: string;

    @Column()
    height?: number;

    @Column()
    width?: number;

    @Column()
    exitDate?: Date;

    @Column()
    minifigs?: number;

    @Column()
    reviewCount?: number;

    @Column()
    themeId: number;

    @Column()
    lastUpdatedAt: Date;
}