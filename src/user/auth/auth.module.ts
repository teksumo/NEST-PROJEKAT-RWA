import { Module } from "@nestjs/common";
import {PassportModule} from "@nestjs/passport"
import { AuthService } from "./auth.service";

import { AuthController } from "./auth.controller";
import { User } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Recepti } from "src/entities/recept.entity";
import { Images } from "src/entities/image.entity";
import { Messages } from "src/entities/message.entity";
import { ReceptService } from "src/recept/recept.service";
import { MessagesService } from "src/messages/messages.service";
import { ImagesService } from "src/images/images.service";
import { JwtGuard } from "./guards/jwt.guard";
import { RolesGuard } from "./guards/roles.guard";



@Module({

    imports: [PassportModule, TypeOrmModule.forFeature([User,Recepti, Images, Messages]), JwtModule.register({
        secret: process.env.JSON_TOKEN_KEY /*`${process.env.JSON_TOKEN_KEY}`*/, //ne znam da li bez ' treba
        signOptions: {expiresIn: '1d'}
    })  ],
    providers: [AuthService,  JwtStrategy, ReceptService, MessagesService, ImagesService, JwtGuard, RolesGuard ],
    controllers: [AuthController],
    exports: [AuthService]

})
export class AuthModule {



}