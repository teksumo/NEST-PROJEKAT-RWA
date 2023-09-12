import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recepti, TypeOfMeal } from 'src/entities/recept.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { ReceptiResponseDto } from './dto/recept.dto';
import { Images } from 'src/entities/image.entity';

interface CreateReceptParams {
    
    name: string;
    publicationDate: Date;
    numberOfIngredients: number;
    typeOfMeal: TypeOfMeal;
    images: {url: string}[];
    kuvar_id: number;
    

}


@Injectable()
export class ReceptService {

    constructor ( @InjectRepository(Recepti) private readonly receptiRepository: Repository<Recepti>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Images) private readonly imagesRepository: Repository<Images>){}

   

    async getRecepti() : Promise<ReceptiResponseDto[]>{

        const recepti = await this.receptiRepository.find();
        return recepti.map((recept) => new ReceptiResponseDto(recept))
    }

    async createRecept(body: CreateReceptParams){

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
            const images: Images[] = await this.imagesRepository.find({
                where: {
                    url: In(["awdawdawdawd"])
                },
                relations: {
                    recept: true
                }
            })
            
            
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
}
