import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '@dotfile-tms/database';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepo: Repository<ApiKey>
  ) {}

  async validate(key: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepo.findOne({ where: { key } });
    return !!apiKey;
  }
}