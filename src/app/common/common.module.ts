import { Module } from '@nestjs/common';
import { CommonService } from './common.service';

@Module({
  providers: [CommonService],
  exports: [CommonModule],
})
export class CommonModule {}
