import { Injectable, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs"
//import { UserType } from '../../entities/user.entity';
import { SignupDto } from '../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import UserType from 'src/enums/UserType';
import { JwtPayload } from 'src/enums/jwtPayload.type';
import { Messages } from 'src/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { cpSync } from 'fs';
import { Recepti } from 'src/entities/recept.entity';
import { ReceptService } from 'src/recept/recept.service';
//import UserType from '../../enums/UserType';

interface SignUpParams {
    firstName: string;
    lastName: string;
    email : string;
    password: string;
    userType?: UserType
}

interface SignInParams {
  email : string;
  password: string;  
}



@Injectable()
export class AuthService {


  //ovo sam dodao
    private jwtService: JwtService
    constructor ( @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Messages) private readonly messagesRepository: Repository<Messages>,
    @InjectRepository(Recepti) private readonly receptiRepository: Repository<Recepti>,
    private messagesService: MessagesService,
    private receptiService : ReceptService

    //private jwtService: JwtService
    
    ){
      //ovo sam dodao
      this.jwtService = new JwtService()
    }

    

    
    async signup(body :SignUpParams ) { //sa SignUpParams i sa SignUpDto smo se osigurali da 100% user mora unese
      //lepe podatke
      try {
              
              const existingUser = await this.userRepository.findOne({  where: { email: body.email } });

              if (existingUser) {
                  throw new ConflictException ('Email koji ste uneli je vec u upotrebi.');
                }


              const hashedPassword = await bcrypt.hash(body.password, 10);
              
              body.password=hashedPassword;

       
              await this.userRepository.create(body);
              

              await this.userRepository.save(body);

              //sad uzimamo id od usera da bi to predali JWT-u da napravi token
              const existingUser2 = await this.userRepository.findOne({  where: { email: body.email } });
              const id=existingUser2.id;
              console.log(existingUser2)

              return this.generateJWT(id, body.firstName, body.email, body.userType);    
              
          }
          catch (err) {
              if (err instanceof HttpException) {
                throw err ;
              } 
              else {
                throw new HttpException('Neuspela registracija.', HttpStatus.INTERNAL_SERVER_ERROR);
              }
          }
  
    }

    async signin ({email, password}: SignInParams) {

      

      const user = await this.userRepository.findOne({  where: { email} });

      if(!user){
        throw new HttpException('Invalid Credentials', 400);
      }

      const hashedPassword = user.password;
      const isValidPassword = await bcrypt.compare(password,hashedPassword);

      if(!isValidPassword){
        throw new HttpException('Invalid Credentials', 400);
        //MORAMO ISTI exceptions da bacimo, da neki zlonameran user ne bi znao dal je netacna sifra ili mail
      }

      return this.generateJWT(user.id,user.firstName, user.email, user.userType); 


    }

    async generateJWT(id: number, name: string, email: string, type:UserType ){

      const jwtPayload: JwtPayload = {
        id: id,
        name,
        email,
        type
      }
      const token=await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
            secret: process.env.JSON_TOKEN_KEY,
            expiresIn: "15m"
        })])

      return token

    }

    async deleteAccount(id:number, id_korisnika_koji_brise:number){

      if(id!=id_korisnika_koji_brise){
        throw new ConflictException ('Ne mozes da brises tudji nalog!');
      }
      
      const existingUser = await this.userRepository.findOne({
        where: {
            id: id
        },
        relations: {
            primljenePoruke: true,
            poslatePoruke: true,
            recepti: true
        }
    });

      if(!existingUser){
        throw new ConflictException ('Ne postoji nalog sa ovim id-om');
      }

        if(existingUser.userType=='KORISNIK' || existingUser.userType=='ADMIN'){
          

          //brisanje poslatih poruka
          if (existingUser.poslatePoruke) {
            for (const message of existingUser.poslatePoruke) {
              // Poziv funkcije za brisanje poruke iz MessagesService
              await this.messagesService.deleteMessageById(message.id);
            }
          }

          //brisanje poslatih poruka
          if (existingUser.primljenePoruke && existingUser.primljenePoruke.length > 0) {
            for (const message of existingUser.primljenePoruke) {
              // Poziv funkcije za brisanje poruke iz MessagesService
              await this.messagesService.deleteMessageById(message.id);
            }
          }

          //brisanje naloga
          await this.userRepository.remove(existingUser)

      } else{

        if (existingUser.recepti) {
          for (const recept of existingUser.recepti) {
            // Poziv funkcije za brisanje poruka za svaki recept
            await this.receptiService.deleteReceptById(recept.id);
          }
          await this.userRepository.remove(existingUser)
        }

      }


    }


 }



