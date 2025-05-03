import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ApiKey } from './api-key.entity';

export const ENTITIES = [Transaction, ApiKey];

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
})
export class EntitiesModule {}
