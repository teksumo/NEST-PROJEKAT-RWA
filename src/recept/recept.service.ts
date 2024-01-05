import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recepti, TypeOfMeal } from 'src/entities/recept.entity';
import { User } from 'src/entities/user.entity';
import { FindManyOptions, In, NumericType, Repository, LessThanOrEqual, MoreThanOrEqual, Between, FindOperator } from 'typeorm';
import { ReceptiResponseDto } from './dto/recept.dto';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';


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
    @InjectRepository(Images) private readonly imagesRepository: Repository<Images>,
    @InjectRepository(Messages) private readonly messagesRepository: Repository<Messages>,
    private messagesService: MessagesService){}

   

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



    async createRecept(body: CreateReceptParams, id:number){
       
        
        console.log(body.images)

        try {
            var id_kuvara_koji_postavlja_recept=0
            if(body.kuvar_id==null){//ovo se koristi ako KUVAR dodaje recept, tad se id uzima iz JWT
            
                id_kuvara_koji_postavlja_recept = id;
            }else{

                id_kuvara_koji_postavlja_recept = body.kuvar_id; //ovo se koristi ukoliko admin dodaje recept,
                //tad se id uzima iz BODY koji prosledi ADMIN, jer ako se tad uzima id iz JWT, stavice se adminov ID a treba od KUVARA
            }
            

            const kuvar: User = await this.userRepository.findOne({
                where: {
                    id: In([id_kuvara_koji_postavlja_recept])
                },
                relations: {
                    recepti: true
                }
            })

            const urls = body.images.map(image => image.url); // izvucemo svaki url: "blabla".SAMO OVAKO RADI

            const newImages: Images[] = [];
            for (const imageUrl of urls) {
                const newImage: Images = new Images();
                newImage.url = imageUrl;
                newImage.recept = null; // Ovo se postavlja tek kada sejvujemo recept
                newImages.push(newImage);
            }

            const savedImages = await this.imagesRepository.save(newImages);

            //AKO KUVAR NIJE STAVIO NI JEDNU SLIKU jela, onda ne moze da se to postavi
            
            
            if (!kuvar) throw new NotFoundException("Kuvar with given id doesnt exist")
            
            const newRecept: Recepti = new Recepti()
            newRecept.name = body.name;
            newRecept.publicationDate = body.publicationDate;
            newRecept.numberOfIngredients = body.numberOfIngredients;
            newRecept.typeOfMeal = body.typeOfMeal;
            newRecept.kuvarId = id_kuvara_koji_postavlja_recept;
            newRecept.kuvar= kuvar;
            newRecept.images=newImages;

            

            await this.receptiRepository.save(newRecept);
           
            kuvar.recepti.push(newRecept);

            
            
           //sad dodeljujemo novokreirani recept novim slikama
            savedImages.forEach(image => {
                image.recept = newRecept;
                image.receptIdBroj=newRecept.id
            });
    
            // cuvamo images i kuvara
            await this.imagesRepository.save(savedImages);
            await this.userRepository.save(kuvar);

          
            
        }
        catch (err) {
            throw new Error(err)
        }
        
        
        
    }


    async updateReceptById(id: number, data: UpdateReceptParams){

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


            //BRISANJE SVIH poruka vezanih za ovaj recept u svim entitetima
            await this.messagesService.deleteMessagesByReceptId(id);


            //brisanje slika povezanih sa brisanim receptom
            const slike = await this.imagesRepository.find({ where: { receptIdBroj: id } });
            await this.imagesRepository.remove(slike)
            
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


    async dodajSlikuZaRecept(receptId: number, imageUrl: string) {
        // Pronađite recept koji želite da ažurirate
        const recept = await this.receptiRepository.findOne({
            where: {
                id: receptId
                
            },
            relations: {
                images: true
            }
        });
        
        if (!recept) {
            throw new NotFoundException('Recept nije pronađen');
        }
    
        // Kreiranje nove slike
        const novaSlika = new Images();
        novaSlika.url = imageUrl;
        novaSlika.recept=recept;
        novaSlika.receptIdBroj=receptId;
        
    
        // cuvanje slike u bazi podataka
        const sacuvanaSlika = await this.imagesRepository.save(novaSlika);
    
        // Poveyivanje slike sa receptom
        recept.images.push(sacuvanaSlika);
    
        // Sačuvajte ažurirani recept
        const azuriraniRecept = await this.receptiRepository.save(recept);
    
        return azuriraniRecept;
        }


        

    //BRISANJE JEDNE SLIKE
    async obrisiSlikuZaRecept(imageId: number): Promise<void> {
    // Provera da li slika postoji
    const slika = await this.imagesRepository.findOne({
        where: {
            id: imageId
            
        },
        relations: {
            recept: true
        }
    });

    if (!slika) {
        throw new NotFoundException('Slika nije pronađena');
    }

    // Proverite da li slika pripada nekom receptu
    if (slika.recept) {
        // Pronađite recept koji ima referencu na ovu sliku
        const recept = await this.receptiRepository.findOne({
        where: {
            id: slika.recept.id
            
        },
        relations: {
            images: true
        }
    });

    console.log("recept pre BRISANJE SLIKE")
    console.log(recept)

        if (recept) {
        // Uklonite sliku iz recepta
        recept.images = recept.images.filter(img => img.id !== imageId);
        await this.receptiRepository.save(recept);
        }

        console.log("recept posle BRISANJE SLIKE")
        console.log(recept)
    }

    // Obrišite sliku
    await this.imagesRepository.remove(slika);
    }


    async oceni(receptId:number, ocena:number){
        const recept = await this.receptiRepository.findOne({
            where: {
                id: receptId
                
            },
            relations: {
                
            }
        });

        if (!recept) {
            throw new NotFoundException('Recept nije pronađen');
        }
    
        // Provera da li je ocena unutar opsega od 1 do 5
        if (ocena < 1 || ocena > 5) {
            throw new BadRequestException('Ocena mora biti između 1 i 5.');
        }
    
        // Ažuriranje broja ocena i izračunavanje nove ocene
        recept.numberOfReviews += 1;
        recept.rating = ((recept.rating * (recept.numberOfReviews - 1)) + ocena) / recept.numberOfReviews;
    
        // Ograničavanje ocene na opseg od 1 do 5
        recept.rating = Math.min(5, Math.max(1, recept.rating));
    
        // Čuvanje promena u bazi podataka
        await this.receptiRepository.save(recept);




    } 

          
        
     
}
