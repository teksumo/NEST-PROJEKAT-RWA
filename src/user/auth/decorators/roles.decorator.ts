import { SetMetadata } from '@nestjs/common';
import UserType from 'src/enums/UserType';

export const ROLES_KEY ='roles'
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
