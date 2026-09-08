import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common'
import type { CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.tenantId) {
      throw new ForbiddenException('Acesso negado: Tenant não identificado na sessão.')
    }

    return true
  }
}
