import { Entity, Column } from 'typeorm';

import { BaseEntity } from './base-entity';

@Entity()
export class Transaction extends BaseEntity {
  @Column({ name: 'source_account' })
  sourceAccount: string;

  @Column({ name: 'target_account' })
  targetAccount: string;

  @Column()
  externalId: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column('jsonb')
  metadata: Record<string, string>;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt?: Date;
}
