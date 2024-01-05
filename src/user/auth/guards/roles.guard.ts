import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import UserType from 'src/enums/UserType';
import { ROLES_KEY } from '../decorators/roles.decorator';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

 

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    

     //ovo koristimo da preuzmemo rolove koji su required iz Kontrolera
    //mi ustvari koristimo reflector da uzmemo context iz Controlera gde se nalazi odredjeno ogranicenje Role-ovima
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    console.log("SAD POCINJE ROLES GUARD")

    //ako nema ogranicenja Role-ovima
    if(!requiredRoles){

      return true
    }

    const { user } = context.switchToHttp().getRequest()
    
    console.log("SAD SE ZAVESAVA ROLES GUARD")

    return requiredRoles.some((role) => user?.type === role)

  }
}
