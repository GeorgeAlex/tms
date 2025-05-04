import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKey } from './api-key.entity';
import { Transaction } from './transaction.entity';

export const ENTITIES = [Transaction, ApiKey];

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
})
export class EntitiesModule {}
