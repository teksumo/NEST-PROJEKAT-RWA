import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { IsInt, IsString, Length, Min } from "class-validator";
import { Recepti } from "./recept.entity";
import { User } from "./user.entity";


@Entity()
export class Messages {


    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsString()
    message: string


    //moramo da napravimo vezu gde ce korisnik moci da salje poruku kuvaru, ali tu ne postoji samo...
    //... veza izmedju korisnika i kuvara nego tu mora da se radi i sa samim receptom, jer mu se on javlja...
    //... za neki recept

    @Column()
    recept_id: number

    //mora u messages da postoji many to one, a u recepti one to many

    //veza messages sa recept
    @ManyToOne(() => Recepti, recept => recept.message,)
    recept?: Recepti

    @Column({ name: "kuvar_Id" })
    kuvarId: number

    @Column({ name: "korisnik_Id" })
    korisnikId: number

  // Veza sa posiljaocem
  @ManyToOne(() => User, user => user.poslatePoruke) // ovde nema cascade jer ne zelimo brisanje korisnika kada se poruke brisu
  posiljalac: User

  // Veza sa primalcem
  @ManyToOne(() => User, user => user.primljenePoruke)
  primalac: User

  //poruke se brisu kada se recepti ili korisnici obrisu

 

    
}