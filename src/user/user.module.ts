import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User } from '../entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [TypeOrmModule.forFeature([User, ]), JwtModule.register({
    secret: `${process.env.JSON_TOKEN_KEY}`,
    signOptions: {expiresIn: '6000s'}
})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class UserModule {}
