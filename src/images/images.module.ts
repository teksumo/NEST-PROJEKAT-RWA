import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Recepti } from 'src/entities/recept.entity';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Recepti, Images, Messages ])],
  controllers: [ImagesController],
  providers: [ImagesService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }]
})
export class ImagesModule {}
