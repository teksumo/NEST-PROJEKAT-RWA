import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ReceptService } from 'src/recept/recept.service';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
    

    constructor(private readonly imagesService: ImagesService){}

    @Delete(':id')
    deleteImages(){}



}
