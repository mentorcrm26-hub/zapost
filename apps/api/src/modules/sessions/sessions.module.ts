import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WASession } from '../../entities/wa-session.entity.js'
import { SessionsService } from './sessions.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([WASession])],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
