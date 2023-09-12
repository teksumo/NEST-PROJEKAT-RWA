import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ReceptController } from './recept.controller';
import { ReceptService } from './recept.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Recepti } from 'src/entities/recept.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Recepti, Images, Messages ])],
  controllers: [ReceptController],
  providers: [ReceptService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }]
})
export class ReceptModule {}
