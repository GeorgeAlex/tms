import { IsString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType() 
@ObjectType()
export class CreateTransactionDto {
  // GraphQL decorators
  @Field()
  // REST decorators
  @ApiProperty({ description: 'The account the transaction is coming from' })
  @IsString()
  sourceAccount!: string;

  // GraphQL decorators
  @Field()
  // REST decorators
  @ApiProperty({ description: 'The account the transaction is going to' })
  @IsString()
  targetAccount!: string;

  // GraphQL decorators
  @Field()
  // REST decorators
  @ApiProperty({ description: 'An idendifier that comes from the source system' })
  @IsString()
  externalId!: string;

  // GraphQL decorators
  @Field(() => Int)
  // REST decorators
  @ApiProperty({ description: 'The amount of the transaction' })
  @IsNumber()
  amount!: number;

  // GraphQL decorators
  @Field()
  // REST decorators
  @ApiProperty({ description: 'The currency in which the transaction is made' })
  @IsString()
  currency!: string;

  // GraphQL decorators
  @Field(() => GraphQLJSON)
  // REST decorators
  @ApiProperty({ description: 'Metadata object that allows for additional information about the transaction' })
  @IsObject()
  metadata!: Record<string, string>;
}
