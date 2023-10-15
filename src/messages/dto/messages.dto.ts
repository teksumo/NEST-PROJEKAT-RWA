import { Exclude, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { TypeOfMeal } from "src/entities/recept.entity";



export class CreateMessageDto{

    @IsString()
    @IsNotEmpty()
    message: string;
    
    @IsNumber()
    recept_id: number

    @IsNumber()
    @IsPositive()
    kuvarId: number

    @IsNumber()
    @IsPositive()
    korisnikId: number

    @IsNumber()
    @IsPositive()
    posiljalacId: number

    @IsNumber()
    @IsPositive()
    primalacId: number


}