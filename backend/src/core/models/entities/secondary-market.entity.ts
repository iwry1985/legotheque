import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'set_info_price' })
@Unique('UQ_infopriceid', ['infopriceid'])
export class SecondaryMarket {
    @PrimaryGeneratedColumn()
    infopriceid: number;

    @Column()
    bricksetid: string;

    @Column()
    condition: string;

    @Column()
    section: string;

    @Column({ nullable: true })
    qty_sold?: number = 0;

    @Column({ nullable: true })
    total_qty?: number = 0;

    @Column({ nullable: true })
    total_sellers?: number = 0;

    @Column('decimal', { nullable: true })
    min_price?: number;

    @Column('decimal', { nullable: true })
    max_price?: number;

    @Column('decimal', { nullable: true })
    avg_price?: number;

    @Column('decimal', { nullable: true })
    qty_avg_price?: number;

    @Column({ nullable: true })
    scrape_time?: Date;
}
