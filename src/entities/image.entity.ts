import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { IsInt, IsString, Length, Min } from "class-validator";
import { Recepti } from "./recept.entity";


@Entity()
export class Images {


    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsString()
    url: string

    @Column({ name: "created_at", default: () => "NOW()" })
    createdAt: Date

    @Column({ name: "updated_at", default: () => "NOW()" })
    updatedAt: Date

    @ManyToOne(() => Recepti, recept => recept.images)
    recept: Recepti
}