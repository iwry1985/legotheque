import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: 'brickset_collection'})
@Unique('UQ_setid', ['setid'])
export class BricketCollection {
    @PrimaryGeneratedColumn()
    brcolid: number;

    @Column()
    setid: number;

    @Column()
    ownedby?: number;

    @Column()
    wantedby?: number;
}