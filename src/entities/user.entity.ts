import { IsEmail, IsString, Length, IsEnum } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Recepti } from "./recept.entity";
import { Messages } from "./message.entity";

export enum UserType {
  KUVAR = 'KUVAR',
  KORISNIK = 'KORISNIK',
  ADMIN = 'ADMIN',
}

@Entity()
@Unique(["email"])
export abstract class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "first_name" })
    @IsString()
    @Length(3, 20)
    firstName: string

    @Column({ name: "last_name" })
    @IsString()
    @Length(3, 20)
    lastName: string

    @Column({ name: "email" })
    @IsEmail()
    email: string

    @Column()
    @IsString()
    @Length(5, 30)
    password: string

    @Column({ name: 'user_type'/*, nullable: true, type: 'varchar'*/ }) // Postavite type na 'enum' i enum opciju
    @IsEnum(UserType)
    userType: UserType;

    @Column({ name: "created_at", default: () => "NOW()" })
    createdAt: Date

    @Column({ name: "updated_at", default: () => "NOW()" })
    updatedAt: Date



    @OneToMany(() => Recepti, recept => recept.kuvar, { cascade: ['remove'] })
    recepti: Recepti[]


      // Veza sa poslatim porukama
    @OneToMany(() => Messages, message => message.posiljalac, { cascade: true })
    poslatePoruke: Messages[] //mozda ovo treba da se zove kuvar messages i korisnik messages DA PROVERIM SVE!

    // Veza sa primljenim porukama
    @OneToMany(() => Messages, message => message.primalac, { cascade: true })
    primljenePoruke: Messages[]

}

