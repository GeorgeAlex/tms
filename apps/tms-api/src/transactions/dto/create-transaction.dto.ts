import { IsString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'The account the transaction is coming from' })
  @IsString()
  sourceAccount: string;

  @ApiProperty({ description: 'The account the transaction is going to' })
  @IsString()
  targetAccount: string;

  @ApiProperty({ description: 'An idendifier that comes from the source system' })
  @IsString()
  externalId: string;

  @ApiProperty({ description: 'The amount of the transaction' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'The currency in which the transaction is made' })
  @IsString()
  currency: string;

  @ApiProperty({ description: 'Metadata object that allows for additional information about the transaction' })
  @IsObject()
  metadata: Record<string, string>;
}
