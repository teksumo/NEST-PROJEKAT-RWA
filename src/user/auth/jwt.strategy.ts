import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import UserType from "src/enums/UserType";
import { JwtPayload } from "src/enums/jwtPayload.type";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //uzimamo token iz headera
            ignoreExpiration: false,
            secretOrKey: process.env.JSON_TOKEN_KEY

        })
        
    }

    async validate(payload: JwtPayload){
        
       // return { ...payload}
       return {id: payload.id, name: payload.name, email:payload.email, type: payload.type}

    }


}