
import { Exclude, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";
import { TypeOfMeal } from "src/entities/recept.entity";

export class ReceptiResponseDto {

    @Exclude()
    numberOfReviews: number;


    constructor(partial: Partial <ReceptiResponseDto>){

        Object.assign(this, partial);
    }
}

class Image {
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

    @IsNumber()
    kuvar_id:number

}

