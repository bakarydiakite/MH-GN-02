import { Module } from '@nestjs/common';
import { BirthsService } from './births.service';
import { BirthsController } from './births.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  providers: [BirthsService],
  controllers: [BirthsController],
})
export class BirthsModule {}
