import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ReceptService } from './recept.service';
import { CreateReceptDto, ReceptiResponseDto, UpdateReceptDto } from './dto/recept.dto';
import { TypeOfMeal } from 'src/entities/recept.entity';
import { max } from 'class-validator';
import { Between } from 'typeorm';

@Controller('recept')
export class ReceptController {

    constructor(private readonly receptiService: ReceptService){}

    @Get()
    getRecepti( 
        @Query('typeOfMeal') typeOfMeal?: TypeOfMeal,
        @Query('minRating') minRating?: string ,
        @Query('maxRating') maxRating?: string,
        @Query('numberOfIngredients') numberOfIngredients1?: string
    ): Promise<ReceptiResponseDto[]>{


        var minimalno=0;
        var maximalno=10;
        
        
        console.log(minRating)

        if(minRating){
            minimalno=parseInt(minRating);
        }
        if(maxRating){
            maximalno=parseInt(maxRating);
        }
       
        if(numberOfIngredients1){
        var numberOfIngredients = parseInt(numberOfIngredients1);
        }
        
        const filters= {
          typeOfMeal,
         
          rating: Between(minimalno, maximalno),
          numberOfIngredients,
          
        }


        return this.receptiService.getRecepti(filters);
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
    updateRecept(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateReceptDto
    ){
        return this.receptiService.updateHomeById(id,body)
    }

    @Delete(':id')
    deleteRecept(
        @Param('id', ParseIntPipe) id: number
    ){


        this.receptiService.deleteReceptById(id);
    }

    

}
