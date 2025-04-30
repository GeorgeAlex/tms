import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '@dotfile-tms/database';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    @InjectQueue('transaction-ingest') private readonly queue: Queue
  ) {}

  @Post()
  @HttpCode(202)
  async create(@Body() transactionData: CreateTransactionDto): Promise<void> {
    await this.queue.add('new-transaction', transactionData);
  }

  @Post('bulk')
  @HttpCode(202)
  async bulkCreate(
    @Body() transactionsData: CreateTransactionDto[]
  ): Promise<void> {
    await Promise.all(
      transactionsData.map((tx) => this.queue.add('new-transaction', tx))
    );
  }

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }
}
