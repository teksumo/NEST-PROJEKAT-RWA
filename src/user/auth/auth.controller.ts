import { Body, Controller, Post, Req, UseGuards, Get, Param, ParseEnumPipe, UnauthorizedException, Delete, ParseIntPipe, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SignInDto, SignupDto } from '../dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import UserType from 'src/enums/UserType';
import * as bcrypt from "bcryptjs"
import { User } from 'src/entities/user.entity';
import { JwtGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}


    @Public()
    @Post('/signup')
    async signup(@Body() body: SignupDto){

        return await this.authService.signup(body)
    }

    @Public()
    @Post('signin')
    async signin (@Body() body: SignInDto){

        return this.authService.signin(body);
    }


    @Roles(UserType.KORISNIK, UserType.KUVAR, UserType.ADMIN)
    @UseGuards(JwtGuard)
    @Delete('/obrisi-nalog/:id')
    async deleteAccount(
        @Param("id", ParseIntPipe) id: number,
        @Request() req
     ) {
        //radim sa req da bi se uporedio id naloga koji korisnik hoce da brise i njegov id, tako da moze samo svoj nalog da obrise
          await this.authService.deleteAccount(id, req.user.id);
          console.log("OBRISANE PORUKE")
      }



}
