import { Module } from "@nestjs/common";
import {PassportModule} from "@nestjs/passport"
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { User } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";



@Module({

    imports: [PassportModule, TypeOrmModule.forFeature([User]), JwtModule.register({
        secret: `${process.env.JSON_TOKEN_KEY}`,
        signOptions: {expiresIn: '6000s'}
    })  ],
    providers: [AuthService, LocalStrategy, JwtStrategy ],
    controllers: [AuthController],
    exports: [AuthService]

})
export class AuthModule {



}