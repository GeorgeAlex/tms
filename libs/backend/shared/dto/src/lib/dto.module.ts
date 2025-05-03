import { Module } from '@nestjs/common';
import { CreateTransactionDto, TransactionDto } from './transaction';

@Module({
  controllers: [],
  providers: [],
  exports: [CreateTransactionDto, TransactionDto],
})
export class DtoModule {}
