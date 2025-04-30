import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from '@dotfile-tms/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { TransactionsProcessor } from './transactions.processor';
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