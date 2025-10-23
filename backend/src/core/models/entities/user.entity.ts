import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Legotheque } from './legotheque.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'users' })
@Unique('UQ_email', ['email'])
export class User {
    @Expose()
    @PrimaryGeneratedColumn()
    userid: number;

    @Expose()
    @Column({ length: 150 })
    username: string;

    @Expose()
    @Column()
    birthdate: Date;

    @Expose()
    @Column({ unique: true })
    email: string;

    @Expose()
    @Column()
    pwd: string;

    @Expose()
    @UpdateDateColumn()
    lastupdatedat: Date;

    @Expose()
    @CreateDateColumn()
    addedat: Date;

    //get legotheque
    @Expose()
    @OneToMany(() => Legotheque, (legotheque) => legotheque.user)
    legotheque: User;

    @Expose()
    get age(): number | undefined {
        if (!this.birthdate) return undefined;

        const birth = new Date(this.birthdate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const hasHadBirthdayThisYear =
            today.getMonth() > birth.getMonth() ||
            (today.getMonth() === birth.getMonth() &&
                today.getDate() >= birth.getDate());

        if (!hasHadBirthdayThisYear) age--;

        return age;
    }
}
