import { Module } from '@nestjs/common';
import { GcpService } from './gcp.service';

@Module({
  providers: [GcpService]
})
export class GcpModule {}
