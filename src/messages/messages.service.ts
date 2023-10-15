import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';
import { Recepti } from 'src/entities/recept.entity';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';


interface CreateMessageParams {
    
    message: string;
    recept_id: number;
    kuvarId: number;
    korisnikId: number;
    posiljalacId: number;
    primalacId: number;
    

}



@Injectable()
export class MessagesService {

    constructor ( @InjectRepository(Recepti) private readonly receptiRepository: Repository<Recepti>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Images) private readonly imagesRepository: Repository<Images>,
    @InjectRepository(Messages) private readonly messagesRepository: Repository<Messages>,){}

    async deleteMessagesByReceptId(receptId: number){
        try {
          const poruke = await this.messagesRepository.find({
            where: {
                recept_id: receptId,
              },
              
          });
      
          // Brišemo poruke
          await this.messagesRepository.remove(poruke);

           // Nakon brisanja poruka, moramo ažurirati veze u entitetu User
    for (const poruka of poruke) {
        // Pronađite korisnike (posiljaoca i primaoca) povezane sa porukom
        const prviCovek = await this.userRepository.findOne({
            where: {
                id: poruka.kuvarId
            },
            relations: {
                poslatePoruke: true,
                primljenePoruke: true,
            }
        });
        const drugiCovek = await this.userRepository.findOne({
            where: {
                id: poruka.korisnikId
            },
            relations: {
                primljenePoruke: true,
                poslatePoruke: true
            }
        });
  
        //brisanje svih primljenih poruka iz prvogCoveka sa id poruke koja se brise
        if (prviCovek && prviCovek.primljenePoruke) {
            prviCovek.primljenePoruke = prviCovek.primljenePoruke.filter(
            (p) => p.id !== poruka.id
          );
          await this.userRepository.save(prviCovek);
        }

        //brisanje svih poslatih poruka iz prvogCoveka sa id poruke koja se brise
        if (prviCovek && prviCovek.poslatePoruke) {
            prviCovek.poslatePoruke = prviCovek.poslatePoruke.filter(
              (p) => p.id !== poruka.id
            );
            await this.userRepository.save(prviCovek);
          }
  

        //brisanje svih poslatih poruka iz drugogCoveka sa id poruke koja se brise  
        if (drugiCovek && drugiCovek.poslatePoruke) {
            drugiCovek.poslatePoruke = drugiCovek.poslatePoruke.filter(
            (p) => p.id !== poruka.id
          );
          await this.userRepository.save(drugiCovek);
        }

        //brisanje svih primljenih poruka iz drugogCoveka sa id poruke koja se brise
        if (drugiCovek && drugiCovek.primljenePoruke) {
            drugiCovek.primljenePoruke = drugiCovek.primljenePoruke.filter(
            (p) => p.id !== poruka.id
          );
          await this.userRepository.save(drugiCovek);
        }

        }
     } catch (error) {
          console.log(error);
        }
      }


      async createMessage(body: CreateMessageParams){

        try {
            const a = body.kuvarId;
            const kuvar: User = await this.userRepository.findOne({
                where: {
                    id: In([a])
                },
                relations: {
                    recepti: true
                }
            })


            const b = body.korisnikId;
            const korisnik: User = await this.userRepository.findOne({
                where: {
                    id: In([b])
                }
                
            })

            const c = body.recept_id;
            const recept: Recepti = await this.receptiRepository.findOne({
                where: {
                    id: In([c])
                },
                relations: {
                    kuvar: true,
                    message:true
                }
                
            })

            const d = body.posiljalacId;
            const posiljalac: User = await this.userRepository.findOne({
                where: {
                    id: In([d])
                },
                relations: {
                    recepti: true,
                    poslatePoruke: true
                }
                
            })

            const e = body.primalacId;
            const primalac: User = await this.userRepository.findOne({
                where: {
                    id: In([e])
                },
                relations: {
                    recepti: true,
                    primljenePoruke: true
                }
                
            })

            
            if (recept.kuvar.id !== recept.kuvarId) {
                throw new Error(`Recept sa ID-om ${body.recept_id} nije povezan sa kuvarom.`);
              }

            if (!kuvar) throw new NotFoundException("Kuvar with given id doesnt exist")
            if (!korisnik) throw new NotFoundException("Korisnik with given id doesnt exist")
            if (!recept) throw new NotFoundException("Recept with given id doesnt exist")

            const newMessage: Messages = new Messages();

            newMessage.message=body.message;
            newMessage.korisnikId=body.korisnikId;
            newMessage.kuvarId=body.kuvarId;
            newMessage.recept_id=body.recept_id;
            newMessage.posiljalac=posiljalac;
            newMessage.primalac=primalac;
            newMessage.recept=recept;

            
            await this.messagesRepository.save(newMessage);
           
           
            primalac.primljenePoruke.push(newMessage);
            posiljalac.poslatePoruke.push(newMessage);
            recept.message.push(newMessage);

            await this.userRepository.save(primalac);
            await this.userRepository.save(posiljalac);
            await this.receptiRepository.save(recept);

            
        }
        catch (err) {
            throw new Error(err)
        }
        

      }
}
