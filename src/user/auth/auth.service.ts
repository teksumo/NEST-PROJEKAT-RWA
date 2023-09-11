import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs"
import { UserType } from '../../entities/user.entity';
import { SignupDto } from '../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
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

    constructor ( @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
    
    ){}

    async signup(body :SignUpParams, userType: UserType ) { //sa SignUpParams i sa SignUpDto smo se osigurali da 100% user mora unese
        //lepe podatke

        
        const existingUser = await this.userRepository.findOne({  where: { email: body.email } });

        if (existingUser) {
            throw new ConflictException ('Email koji ste uneli je vec u upotrebi.');
          }


        const hashedPassword = await bcrypt.hash(body.password, 10);
        
        body.password=hashedPassword;
        
          

          /*if (![UserType.KUVAR, UserType.KORISNIK, UserType.ADMIN].includes(body.userType)) {
            throw new ConflictException('Niste uneli ispravnu vrstu korisnika.');
          } */  

        
          try {
                await this.userRepository.create(body);
                

                await this.userRepository.save(body);
                
                
                 }
                 catch (err) {
                            throw new Error(err)
                }

          return this.generateJWT(body.firstName, body.email);    

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
        //MORAMO ISTI exceptions da bacimo, da neki zlonameran user ne bi znao dal je netacna sifra il mail
      }

      return this.generateJWT(user.firstName, user.email); 


    }

    private generateJWT(name: string, email: string){
      return this.jwtService.sign({
        name,
        email
      })   

    }


    //Posto u mojoj aplikaciji mogu da se sign upuju useri kao: Korisnik, Kuvar ili Admin,
    //moram da napravim tako da svaki tip usera ima poseban JWT.
    //Aplikacija je osmisljena tako da kad neko oce da se prijavi kao Kuvar, mora da kontaktira..
    //.. admina, da mu dokaze da je kuvar, i onda da mu admin da poseban KEY s kojim ce moci da
    //dobije account za kuvara

    //funkcija kojom ce admin dodeljivati poseban key kuvaru:

    generateProductKey(email: string, userType: UserType){
      //pravimo poseban string (za svakog kuvara) koji cemo da hashujemo
      const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

      return bcrypt.hash(string,10);

      //i onda kad dobiju Kuvari ovaj token, onda mogu da se sign upuju kao kuvari, samo 
      //proslede ovaj token i imaju dozvolu da postanu kuvar

    }





  
    }



