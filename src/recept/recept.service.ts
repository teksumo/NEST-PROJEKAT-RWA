import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recepti, TypeOfMeal } from 'src/entities/recept.entity';
import { User } from 'src/entities/user.entity';
import { FindManyOptions, In, NumericType, Repository, LessThanOrEqual, MoreThanOrEqual, Between, FindOperator } from 'typeorm';
import { ReceptiResponseDto } from './dto/recept.dto';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';


interface CreateReceptParams {
    
    name: string;
    publicationDate: Date;
    numberOfIngredients: number;
    typeOfMeal: TypeOfMeal;
    images: {url: string}[];
    kuvar_id: number;
    

}

interface UpdateReceptParams {
    
    name?: string;
    publicationDate?: Date;
    numberOfIngredients?: number;
    typeOfMeal?: TypeOfMeal;
    kuvar_id?: number;
    

}



interface GetReceptiParams {
    typeOfMeal?: TypeOfMeal
    ;
    numberOfIngredients ?:number

    rating?:FindOperator<number>
    
    
}


@Injectable()
export class ReceptService {

    constructor ( @InjectRepository(Recepti) private readonly receptiRepository: Repository<Recepti>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Images) private readonly imagesRepository: Repository<Images>){}

   

    async getRecepti(filter: GetReceptiParams) : Promise<ReceptiResponseDto[]>{
        console.log(filter)

        const wheree: any = {};

        

        const recepti = await this.receptiRepository.find({

            relations: {
                images:true,
                kuvar: true
            },

            select: {
                images: {
                    url: true,
                    
                }
                
            },
           where: filter
           
            
           

            }
        );

        if(!recepti.length){
            throw new NotFoundException();
        }

        return recepti.map((recept) => new ReceptiResponseDto(recept)); //svaki recept wrapujemo
        //sa nasim DTO-om da bi se prikazalo kako hocemo
       
    }





    async createRecept(body: CreateReceptParams){
        console.log(body.images)

        try {
            const a = body.kuvar_id;
            const kuvar: User = await this.userRepository.findOne({
                where: {
                    id: In([a])
                },
                relations: {
                    recepti: true
                }
            })
            const urls = body.images.map(image => image.url); // izvucemo svaki url: "blabla".SAMO OVAKO RADI
            const images: Images[] = await this.imagesRepository.find({
                where: {
                    url: In(urls) 
                },
                relations: {
                    recept: true 
                }
            })
            console.log(images)
            
            
            if (!kuvar) throw new NotFoundException("Kuvar with given id doesnt exist")
            if (!images) throw new NotFoundException("You must provides valid images for this recipe")
            const newRecept: Recepti = new Recepti()
            newRecept.name = body.name;
            newRecept.publicationDate = body.publicationDate;
            newRecept.numberOfIngredients = body.numberOfIngredients;
            newRecept.typeOfMeal = body.typeOfMeal;
            newRecept.kuvarId = body.kuvar_id;
            newRecept.kuvar= kuvar;
            newRecept.images=images;



            await this.receptiRepository.save(newRecept);
           
            kuvar.recepti.push(newRecept);

            
            
            images.forEach(image => {
                
                image.recept = newRecept;
            })
            await this.imagesRepository.save(images);
            await this.userRepository.save(kuvar);
        }
        catch (err) {
            throw new Error(err)
        }
        
        
        
    }


    async updateHomeById(id: number, data: UpdateReceptParams){

        try{
        let recept = await this.receptiRepository.findOneBy({ id })

        if(!recept){
            throw new NotFoundException( "Recept with given id doesn't exist");
        }

        recept = {
            ...recept,
            ...data
        }

        return await this.receptiRepository.save(recept)
    }
    catch (err){

        console.log(err)
    }
    }


    async deleteReceptById(id: number){

        try {
            // Prvo pokušavamo pronaći recept sa datim ID-om
            const recept = await this.receptiRepository.findOneBy({ id });
      
            if (!recept) {
              throw new NotFoundException(`Recept sa ID-om ${id} nije pronađen.`);
            }
      
            const a = recept.kuvarId;
            const user: User = await this.userRepository.findOne({
                where: {
                    id: In([a])
                },
                relations: {
                    recepti: true
                }
            })

            
            
            // Pronađemo korisnika kome pripada ovaj recept
            //const user = await this.userRepository.findOne(recept.kuvarId);
      
            if (!user) {
              throw new Error(`Korisnik sa ID-om ${recept.kuvarId} nije pronađen.`);
            }
      
            // Pronađemo indeks recepta u nizu recepata korisnika
            const receptIndex = user.recepti.findIndex(r => r.id === id);
      
            if (receptIndex === -1) {
              throw new Error(`Recept sa ID-om ${id} nije pronađen kod korisnika.`);
            }

            //ODAVDE JE BRISANJE USERA, I SVIH RECEPATA I IMAGES SA TAJ RECEPT
           
            const slikee = await this.imagesRepository.find({ where: { receptIdBroj: id } });

            await this.imagesRepository.remove(slikee);
            
            await this.receptiRepository.remove(user.recepti);

            await this.userRepository.remove(user)

            //DO OVDE, to treba da premestim u user service
      

            
            //BRISANJE RECEPTA NASTAVAK
            //TREBA PORUKE DA SE IZBRISU, ali onda mora i iz user-a da se izbrisu sve te poruke
            //koje su bile vezane za ovaj recept. Znaci da cu iz ovog service-a morati da 
            //pozovem funkciju iz message servica, koji ce da brise poruke sa ID recepta

            //brisanje slika povezanih sa brisanim receptom
            const slike = await this.imagesRepository.find({ where: { receptIdBroj: id } });
            await this.imagesRepository.remove(slike);
            
            // Uklanjamo recept iz niza recepata korisnika
            user.recepti.splice(receptIndex, 1);
      
            // Sačuvavamo ažuriranog korisnika u bazi podataka
            await this.userRepository.save(user);
      
            // Sada brišemo recept iz baze podataka
            await this.receptiRepository.remove(recept);
            
          } catch (error) {
            console.log(error)
          }
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        /*
        try{

            const recept: Recepti = await this.receptiRepository.findOne({
                where:{
                    id
                },
                relations:{


                    kuvar: true,
                    images:true,
                    message:true
                },
                select: {
                    id: true,
                    publicationDate: true,
                    numberOfIngredients: true,
                    rating: true,
                    numberOfReviews: true,
                    kuvar:{
                        id:true
                    },
                    images:{

                        url:true

                    },
                    message:{
                        id: true
                    }
                }
            })

            if(!recept) throw new NotFoundException("Recept with given id doesn't exist");


            //prikupljam sve slike i poruke koje su vezane za ovaj recept
            const slike: Images[] = recept.images;
            const poruke: Messages[] = recept.message;

            for(const sl of slike){
                
            }
        }
        catch(err){
            console.log(err)
        }
        
    }
    */
}
