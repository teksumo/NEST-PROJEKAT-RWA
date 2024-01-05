import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User } from '../entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Recepti } from 'src/entities/recept.entity';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { ReceptService } from 'src/recept/recept.service';



@Module({
  imports: [TypeOrmModule.forFeature([User, Recepti, Images, Messages ]), JwtModule.register({
    secret: `${process.env.JSON_TOKEN_KEY}`,
    signOptions: {expiresIn: '6000s'}
})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MessagesService, ReceptService]
})
export class UserModule {}
