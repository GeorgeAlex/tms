import { Module } from '@nestjs/common';

import { ApiDatabaseModule } from './database/database.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BullModule } from '@nestjs/bullmq';
import { ApiKeyModule } from './api-key/api-key.module';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [
    ApiDatabaseModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ApiKeyModule,
    TransactionsModule,
  ],
  providers: [ApiKeyGuard],
})
export class ApiModule {}
