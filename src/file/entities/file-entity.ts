import { number } from "joi";
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FileRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    // жалко, что нет чего-нибудь типа "системы типов содержимого Django"
    @Column()
    essenceTable: string;

    @Column()
    essenceId: number;

    // необходимо хранить эту информацию не только в таблице 'essenceTable' (например TextBlock) но и здесь. 
    // Если из 'essenceTable' запись удалили - то как иначе мв определим к какому файлу относится запись в таблице FileRecord?
    @Column()
    filePath: string;
}