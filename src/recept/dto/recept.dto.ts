
import { Exclude, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { TypeOfMeal } from "src/entities/recept.entity";

export class ReceptiResponseDto {

    //excludovacemo neke stvari koje necemo da se prikazuju kad se gettuju homes
        id: number;
        name: string;
        publicationDate: Date;
        numberOfIngredients: number;
        rating: number;
        numberOfReviews: number;
        typeOfMeal: TypeOfMeal;
        @Exclude()
        createdAt: Date;
        @Exclude()
        updatedAt: Date;

        @Exclude()
        kuvarId: number;


    constructor(partial: Partial <ReceptiResponseDto>){

        Object.assign(this, partial);
    }
}

class Image {
    @IsString()
    @IsNotEmpty()
    url: string 
}




export class CreateReceptDto{

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsDate()
    publicationDate: Date

    @IsNumber()
    @IsPositive()
    numberOfIngredients: number

    @IsEnum(TypeOfMeal)
    typeOfMeal: TypeOfMeal;

    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>Image)
    images: Image[]

    @IsOptional()
    @IsNumber()
    kuvar_id:number 

}


export class UpdateReceptDto
{

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
    
    @IsOptional()
    @IsDate()
    publicationDate?: Date

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfIngredients?: number

    @IsOptional()
    @IsEnum(TypeOfMeal)
    typeOfMeal?: TypeOfMeal;

// za images cemo da napravimo novi endpoint

    @IsOptional()
    @IsNumber()
    kuvar_id?:number

}

