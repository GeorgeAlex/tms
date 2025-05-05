import { ApiKey } from '@dotfile-tms/database';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { ApiKeyService } from './api-key.service';

describe('ApiKeyService', () => {
    let service: ApiKeyService;
    let repository: Repository<ApiKey>;
  
    const mockRepository = {
      findOne: jest.fn(),
    };
  
    const mockApiKey: ApiKey = {
      id: '1',
      key: 'test-api-key',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ApiKeyService,
          {
            provide: getRepositoryToken(ApiKey),
            useValue: mockRepository,
          },
        ],
      }).compile();
  
      service = module.get<ApiKeyService>(ApiKeyService);
      repository = module.get<Repository<ApiKey>>(getRepositoryToken(ApiKey));
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('validate', () => {
      it('should return true for valid API key', async () => {
        mockRepository.findOne.mockResolvedValue(mockApiKey);
  
        const result = await service.validate('test-api-key');
  
        expect(repository.findOne).toHaveBeenCalledWith({
          where: { key: 'test-api-key' }
        });
        expect(result).toBe(true);
      });
  
      it('should return false for invalid API key', async () => {
        mockRepository.findOne.mockResolvedValue(null);
  
        const result = await service.validate('invalid-key');
  
        expect(repository.findOne).toHaveBeenCalledWith({
          where: { key: 'invalid-key' }
        });
        expect(result).toBe(false);
      });
    });
  });