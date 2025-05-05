import { CreateTransactionDto, TransactionDto } from '@dotfile-tms/dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Get, Post, Body, HttpCode, ParseArrayPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Queue } from 'bullmq';

import { TransactionsService } from './transactions.service';
import { RuleEngineService } from '../rule-engine/rule-engine.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly ruleEngineService: RuleEngineService,
    @InjectQueue('transaction-ingest') private readonly queue: Queue
  ) {}

  @Post()
  @HttpCode(202)
  @ApiOperation({ summary: 'Create a new transaction asynchronously' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 202,
    description: 'Transaction accepted for processing',
  })
  async create(@Body() transactionData: CreateTransactionDto): Promise<void> {
    await this.queue.add('new-transaction', transactionData);
  }

  @Post('instant')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create and process a transaction synchronously' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'Transaction processed successfully',
    type: TransactionDto,
  })
  async createInstant(
    @Body() transactionData: CreateTransactionDto
  ): Promise<TransactionDto> {
    const processedTransaction =
      await this.ruleEngineService.processTransaction(transactionData);

    return this.transactionsService.create(processedTransaction);
  }

  @Post('bulk')
  @HttpCode(202)
  @ApiOperation({ summary: 'Create multiple transactions asynchronously' })
  @ApiBody({ type: [CreateTransactionDto] })
  @ApiResponse({
    status: 202,
    description: 'Transactions accepted for processing',
  })
  async bulkCreate(
    @Body(
      new ParseArrayPipe({
        items: CreateTransactionDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    transactionsData: CreateTransactionDto[]
  ): Promise<void> {
    await Promise.all(
      transactionsData.map((tx) => this.queue.add('new-transaction', tx))
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of all transactions',
    type: [TransactionDto],
  })
  findAll(): Promise<TransactionDto[]> {
    return this.transactionsService.findAll();
  }
}
