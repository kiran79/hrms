import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@bharat-hrms/domain";
import { ROLES_KEY } from "./roles.decorator";
import { TenantContext } from "../tenant/tenant-context";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    @Inject(TenantContext)
    private readonly tenant: TenantContext
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles?.length) return true;

    const activeRoles = this.tenant.value.roles;
    return activeRoles.includes("SUPER_ADMIN") || requiredRoles.some((role) => activeRoles.includes(role));
  }
}
