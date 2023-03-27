import { Profile } from "src/profile/entitties/profile-entities";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({ type: String })
    login: string;

    @Column({ type: String })
    email: string;

    @Column({ type: String })
    password: string;

    @OneToOne(
        () => Profile,
        (profile) => profile.user,
    )
    profile: Profile;

    async setPassword(password: string, hash: number = 10) {
        this.password = await bcrypt.hash(password, hash);
    }

    async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
} 