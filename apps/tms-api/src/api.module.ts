import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ApiKeyModule } from './api-key/api-key.module';
import { ApiDatabaseModule } from './database/database.module';
import { ApiKeyGuard } from './guards/api-key.guard';
import { TransactionsModule } from './transactions/transactions.module';

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
