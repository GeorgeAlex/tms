import { IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTransactionDto } from './create-transaction.dto';

export class TransactionDto extends CreateTransactionDto {
  @IsUUID()
  id: string;

  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @Type(() => Date)
  @IsDate()
  processedAt: Date;
}