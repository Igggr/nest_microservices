import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbstractRoleGuard } from './role-checker';


@Injectable()
export class SameUserOrHasRoleGuard extends AbstractRoleGuard {
  
  constructor(reflector: Reflector) { super(reflector) }

  check(req, user, requiredRoles: string[]) {
    return this.sameUser(req, user) || this.checkRole(user, requiredRoles);
  }
  
  sameUser(req, user): boolean {
    const userId = +req.params.id;
    console.log(`DELETE /user/${userId}, from user ${user.id}`);
    if (user.id === userId) {
      console.log('Тот же юзер')
      return true;
    }
    return false;
  }

}
