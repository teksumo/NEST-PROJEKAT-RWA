import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //uzimamo token iz headera
            ignoreExpiration: false,
            secretOrKey: 'test'

        })
    }

    async validate (username: string, password :string) : Promise <any>{

        return "success";
    }

}