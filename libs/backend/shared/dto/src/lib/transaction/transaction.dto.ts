import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsUUID, IsDate } from 'class-validator';

import { CreateTransactionDto } from './create-transaction.dto';


@ObjectType()
export class TransactionDto extends CreateTransactionDto {
  // GraphQL decorators
  @Field(() => ID)
  // REST decorators
  @IsUUID()
  id!: string;

  // GraphQL decorators
  @Field(() => Date)
  // REST decorators
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  // GraphQL decorators
  @Field(() => Date)
  // REST decorators
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  // GraphQL decorators
  @Field(() => Date, { nullable: true })
  // REST decorators
  @Type(() => Date)
  @IsDate()
  processedAt?: Date;
}