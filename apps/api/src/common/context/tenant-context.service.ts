import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'node:async_hooks'

export interface TenantContext {
  tenantId: string
  userId?: string
  role?: string
}

@Injectable()
export class TenantContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<TenantContext>()

  runWithContext(context: TenantContext, callback: () => Promise<any>): Promise<any> {
    return TenantContextService.asyncLocalStorage.run(context, callback)
  }

  getTenantId(): string | undefined {
    const store = TenantContextService.asyncLocalStorage.getStore()
    return store?.tenantId
  }

  getUserId(): string | undefined {
    const store = TenantContextService.asyncLocalStorage.getStore()
    return store?.userId
  }

  getRole(): string | undefined {
    const store = TenantContextService.asyncLocalStorage.getStore()
    return store?.role
  }

  getContext(): TenantContext | undefined {
    return TenantContextService.asyncLocalStorage.getStore()
  }
}
