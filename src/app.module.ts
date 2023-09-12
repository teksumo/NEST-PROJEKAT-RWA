import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth/auth.module';
import { ReceptModule } from './recept/recept.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UserModule, AuthModule, ReceptModule  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}


//mora da se authentifikuje user pri sign up