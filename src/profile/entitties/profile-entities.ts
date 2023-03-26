import { User } from "src/user/entities/user-entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({ type: String })
    name: string;

    @Column({ type: String })
    surname: string;

    @Column({ type: String })
    phone: string;

    @JoinColumn()
    @OneToOne(
        () => User,
        (user) => user.profile,
        { cascade: true }
    )
    user: User;
} 