import { Entity, Column } from 'typeorm';

import { BaseEntity } from './base-entity';

@Entity()
export class ApiKey extends BaseEntity {
  @Column({ unique: true })
  key: string;
}
