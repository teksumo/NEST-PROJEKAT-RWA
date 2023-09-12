import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ReceptService } from './recept.service';
import { CreateReceptDto, ReceptiResponseDto } from './dto/recept.dto';

@Controller('recept')
export class ReceptController {

    constructor(private readonly receptiService: ReceptService){}

    @Get()
    getRecepti(): Promise<ReceptiResponseDto[]>{

        return this.receptiService.getRecepti();
    }

    
    @Get(':id')
    getReceptiById(){

        return {}
    }

    @Post()
    createRecept(@Body() body: CreateReceptDto ){
        return this.receptiService.createRecept(body);
    }

    @Put(':id')
    updateRecept(){
        return {}
    }

    @Delete(':id')
    deleteRecept(){


    }

    

}
