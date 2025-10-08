import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users_dev' })
@Unique('UQ_email', ['email'])
export class User {
    @PrimaryGeneratedColumn()
    userid: number;

    @Column()
    username: string;

    @Column()
    age: number;

    @Column({ unique: true })
    email: string;

    @UpdateDateColumn()
    lastupdatedat: Date;

    @CreateDateColumn()
    addedat: Date;
}
