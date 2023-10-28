import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entities/image.entity';
import { Messages } from 'src/entities/message.entity';
import { Recepti } from 'src/entities/recept.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {

    constructor ( @InjectRepository(Recepti) private readonly receptiRepository: Repository<Recepti>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Images) private readonly imagesRepository: Repository<Images>,
    @InjectRepository(Messages) private readonly messagesRepository: Repository<Messages>,){}


    
}
