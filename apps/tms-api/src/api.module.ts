import { Module } from '@nestjs/common';

import { ApiDatabaseModule } from './database/database.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ApiDatabaseModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TransactionsModule,
  ],
})
export class ApiModule {}
