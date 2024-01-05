import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  
    constructor(private reflector: Reflector) {
        super();
    }
    

    canActivate(context: ExecutionContext) {
        console.log("POCINJE JWT GUARD")
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),   
            context.getClass()
        ])
 
        //ako je ruta public onda samo vratimo true
        if (isPublic) return true

        console.log("ZAVRSAVA SE JWT GUARD")

        return super.canActivate(context)
    }
}
