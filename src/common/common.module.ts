import { Module } from '@nestjs/common';
import { MicroservicesModule } from './microservices/microservices.module';

@Module({
  imports: [MicroservicesModule],
})
export class CommonModule {}
