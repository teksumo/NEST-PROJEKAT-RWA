import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { ReceptService } from './recept.service';
import { CreateReceptDto, ReceptiResponseDto, UpdateReceptDto } from './dto/recept.dto';
import { TypeOfMeal } from 'src/entities/recept.entity';
import { max } from 'class-validator';
import { Between } from 'typeorm';
import { JwtGuard } from 'src/user/auth/guards/jwt.guard';
import { Roles } from 'src/user/auth/decorators/roles.decorator';
import UserType from 'src/enums/UserType';
import { RolesGuard } from 'src/user/auth/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/user/auth/decorators/public.decorator';

@Controller('recept')
export class ReceptController {

    constructor(private readonly receptiService: ReceptService){}


    @Public()
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

    @Roles(UserType.KORISNIK, UserType.ADMIN)
    @Post('/oceni/:receptId/:ocena')
    async oceni(
        @Param("receptId", ParseIntPipe) receptId: number,
        @Param("ocena", ParseIntPipe) ocena: number
    ){
        return await this.receptiService.oceni(receptId, ocena);
    }
    
    @Roles(UserType.KUVAR, UserType.ADMIN)
    @UseGuards(JwtGuard)
    //@Roles(UserType.KUVAR)
    @Post() //ovde iza ovo @Body... treba da stoji @Request req, i onda da se iz tog req uzme user preko jwt??
    createRecept(@Body() body: CreateReceptDto, @Request() req){
        
        
        return this.receptiService.createRecept( body, req.user.id);
    }

    @Roles(UserType.KUVAR, UserType.ADMIN)
    @Put(':id')
    updateRecept(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateReceptDto
    ){
        return this.receptiService.updateReceptById(id,body)
    }

    @Roles(UserType.KUVAR, UserType.ADMIN)
    @Delete(':id')
    deleteRecept(
        @Param('id', ParseIntPipe) id: number
    ){


        this.receptiService.deleteReceptById(id);
    }

    @Roles(UserType.KUVAR, UserType.ADMIN)
    @Post('/dodaj-sliku/:receptId/:imageUrl') // Dodali smo imageUrl kao parametar rute
    async dodajSlikuZaRecept(
      @Param("receptId", ParseIntPipe) receptId: number,
      @Param('imageUrl') imageUrl: string, // Dohvatili smo imageUrl iz rute
    ) {
            const azuriraniRecept = await this.receptiService.dodajSlikuZaRecept(receptId, imageUrl);

      }

    @Roles(UserType.KUVAR, UserType.ADMIN)
    @Delete('/obrisi-sliku/:imageId')
    async obrisiNalog(@Param('imageId') imageId: number) {
        await this.receptiService.obrisiSlikuZaRecept(imageId);
    }

}
