import {
  Injectable,
} from '@nestjs/common'
import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { TenantContextService } from '../context/tenant-context.service.js'

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private tenantContextService: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (user?.tenantId) {
      return new Observable((subscriber) => {
        this.tenantContextService.runWithContext(
          {
            tenantId: user.tenantId,
            userId: user.sub || user.userId,
            role: user.role,
          },
          async () => {
            next.handle().subscribe(subscriber)
          }
        )
      })
    }

    return next.handle()
  }
}
