import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbstractRoleGuard } from './role-checker';

@Injectable()
export class RoleGuard extends AbstractRoleGuard {
  // а вот ту Dependency Injection аодкладывает свинью 
  // приходится делать конструктор в дочернем классе, который тупо 
  // переадресует родительскому - иначе свойство reflector потеряется
  constructor(reflector: Reflector) { super(reflector) }

  check(_, user, requiredRoles: string[]) {
    return this.hasRole(user, requiredRoles);
  }

}
