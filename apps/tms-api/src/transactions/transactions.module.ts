import { Transaction } from '@dotfile-tms/database';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsController } from './transactions.controller';
import { TransactionsProcessor } from './transactions.processor';
import { TransactionsService } from './transactions.service';
import { RuleEngineModule } from '../rule-engine/rule-engine.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'transaction-ingest' }),
    TypeOrmModule.forFeature([Transaction]),
    RuleEngineModule,
  ],
  providers: [TransactionsService, TransactionsProcessor],
  controllers: [TransactionsController],
})
export class TransactionsModule {}