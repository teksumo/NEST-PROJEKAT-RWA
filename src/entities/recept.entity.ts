import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { IsEnum, IsInt, IsString, Length, Min } from "class-validator";
import { Images } from "./image.entity";
import { User } from "./user.entity";
import { Messages } from "./message.entity";

export enum TypeOfMeal {
    SLATKO = 'SLATKO',
    SLANO = 'SLANO'
}

@Entity()
export class Recepti {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsString()
    @Length(1, 100)
    name: string

    @Column({ name: "publicationDate" })
    publicationDate: Date

    @Column({ name: "number_of_ingredients" })
    @IsInt()
    @Min(1)
    numberOfIngredients: number

    @Column({ type: "float", default: 0 })
    rating: number

    @Column({ type: "integer", default: 0 })
    numberOfReviews: number

    @Column({ name: "type_of_meal" })
    @IsEnum(TypeOfMeal)
    typeOfMeal: TypeOfMeal;

    @Column({ name: "created_at", default: () => "NOW()" })
    createdAt: Date

    @Column({ name: "updated_at", default: () => "NOW()" })
    updatedAt: Date


    @OneToMany(() => Images, image => image.recept)
    images: Images[]

    @Column({ name: "kuvar_id" })
    kuvarId: number

    @ManyToOne(() => User, user => user.recepti)
    kuvar: User

    //veza sa porukama
    @OneToMany(() => Messages, message => message.recept)
    message?: Messages[]

    //moze da postoji vise poruka za jedan recept, a svaka poruka pripada samo jednom receptu
    
   


}


