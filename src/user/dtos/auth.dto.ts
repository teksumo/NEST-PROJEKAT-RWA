import { IsString, IsNotEmpty, IsEmail, MinLength, IsEnum, IsOptional } from "class-validator";
//import {UserType }  from '../../entities/user.entity';
import UserType from '../../enums/UserType';


export class SignupDto {

    //definisati sta nam treba:
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    
    //@IsNotEmpty()
    @IsEnum(UserType)
    userType: UserType;
    

    @IsOptional()
    productKey?: string 


}

export class SignInDto {

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class GenerateProductKeyDto {

    @IsEmail()
    email: string;

    @IsEnum(UserType)
    userType: UserType;
}