import { CreateTransactionDto } from '@dotfile-tms/dto';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { TransactionsService } from './transactions.service';
import { RuleEngineService } from '../rule-engine/rule-engine.service';

@Processor('transaction-ingest')
export class TransactionsProcessor extends WorkerHost {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly ruleEngineService: RuleEngineService
  ) {
      super();
  }

  async process(job: Job<CreateTransactionDto>): Promise<void> {
    const processedTransaction = await this.ruleEngineService.processTransaction(job.data);

    await this.transactionsService.create(processedTransaction);
  }
}
