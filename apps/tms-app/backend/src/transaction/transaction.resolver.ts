import {
  CreateTransactionDto,
  CreateTransactionResponseDto,
  TransactionDto,
} from '@dotfile-tms/dto';
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';

import { RestClientService } from '../rest-client/rest-client.service';

@Resolver(() => TransactionDto)
export class TransactionsResolver {
  constructor(private readonly ingestClient: RestClientService) {}

  @Query(() => [TransactionDto], { name: 'transactions' })
  async getAll(): Promise<TransactionDto[]> {
    return this.ingestClient.listTransactions();
  }

  @Mutation(() => CreateTransactionResponseDto)
  async createTransaction(
    @Args('input') input: CreateTransactionDto
  ): Promise<CreateTransactionResponseDto> {
    await this.ingestClient.createTransaction(input);

    return {
      success: true,
      message: 'Transaction creation request accepted.',
    };
  }

  @ResolveField(() => Date)
  async createdAt(
    @Parent() transaction: TransactionDto
  ): Promise<Date> {
    return new Date(transaction.createdAt);
  }

  @ResolveField(() => Date)
  async updatedAt(
    @Parent() transaction: TransactionDto
  ): Promise<Date> {
    return new Date(transaction.updatedAt);
  }

  @ResolveField(() => Date, { nullable: true })
  async processedAt(
    @Parent() transaction: TransactionDto
  ): Promise<Date | null> {
    return transaction.processedAt ? new Date(transaction.processedAt) : null;
  }
}
