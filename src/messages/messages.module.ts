import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Recepti } from 'src/entities/recept.entity';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User,Recepti, Images, Messages ])],
  controllers: [MessagesController],
  providers: [MessagesService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }]
})
export class MessagesModule {}
