import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import UserType from "src/enums/UserType";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //uzimamo token iz headera
            ignoreExpiration: false,
            secretOrKey: process.env.JSON_TOKEN_KEY

        })
        
    }

    async validate(payload: any){
        
        return { ...payload}

    }


}