import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export interface SessionClaims {
  sub: string;
  tenantId: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  verifyBearerToken(header?: string): SessionClaims {
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }
    return this.jwt.verify<SessionClaims>(header.slice("Bearer ".length));
  }
}
