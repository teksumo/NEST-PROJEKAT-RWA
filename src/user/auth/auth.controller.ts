import { Body, Controller, Post, Req, UseGuards, Get, Param, ParseEnumPipe, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SignInDto, SignupDto } from '../dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import UserType from 'src/enums/UserType';
import * as bcrypt from "bcryptjs"

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}


    //OVDE SAMO DA POPRAVIM DA NE MORAM U POSTMAN DA UNESEM userType, nego da se iz URL upise
    //u bazu userType. To da radim nesto sa signupDto i user enitity
    @Post('/signup/:userType')
    async signup(@Body() body: SignupDto, 
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType){

        //moramo razvrstati slucaj kad hoce obican korisnik da se sign upuje, i kad oce Kuvar

        
        if(userType !== UserType.KORISNIK){

            
            if(!body.productKey){
                

                throw new UnauthorizedException("Ne moze bez KEY-A")
                
            }

            

            const validProductKey =`${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);


            
            if(!isValidProductKey){
                
                throw new UnauthorizedException("Los ti je key");
                

            }
            return await this.authService.signup(body, userType)

        }
        return await this.authService.signup(body, userType)
    }

   
    @Post('signin')
    async signin (@Body() body: SignInDto){

        return this.authService.signin(body);
    }


    //endpoint za dobijanje key-a koji je potreban da bi se otvorio nalog za Kuvara
    //samo admin moze da accesuje ovaj endpoint
    @Post("/key")
    generateProductKey(@Body() {userType, email}: GenerateProductKeyDto){

        return this.authService.generateProductKey(email, userType)
    }



}
