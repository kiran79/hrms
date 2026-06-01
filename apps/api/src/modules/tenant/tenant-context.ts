import { Injectable, Scope } from "@nestjs/common";

export interface TenantRequestContext {
  tenantId: string;
  userId: string;
  roles: string[];
}

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private context: TenantRequestContext = {
    tenantId: "demo-tenant",
    userId: "system",
    roles: ["SUPER_ADMIN"]
  };

  set(next: TenantRequestContext) {
    this.context = next;
  }

  get value() {
    return this.context;
  }
}
