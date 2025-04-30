import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Transaction } from '@dotfile-tms/database';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<TransactionDto> {
    const newTransaction = await this.repo.save(dto);

    return this.transformTransaction(newTransaction);
  }

  async bulkInsert(dtos: TransactionDto[]): Promise<void> {
    await this.repo.insert(dtos);
  }

  async findAll(): Promise<TransactionDto[]> {
    const transactions = await this.repo.find();
    return transactions.map(this.transformTransaction);
  }

  private transformTransaction(transaction: Transaction): TransactionDto {
    return plainToInstance(TransactionDto, transaction);
  }
}