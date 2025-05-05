import { Transaction } from '@dotfile-tms/database';
import { CreateTransactionDto } from '@dotfile-tms/dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;

  const mockRepository = {
    save: jest.fn(),
    insert: jest.fn(),
    find: jest.fn(),
  };

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      sourceAccount: 'source1',
      targetAccount: 'target1',
      externalId: 'ext1',
      amount: 100,
      currency: 'USD',
      metadata: { key: 'value1' },
      createdAt: new Date(),
      updatedAt: new Date(),
      processedAt: new Date(),
    },
    {
      id: '2',
      sourceAccount: 'source2',
      targetAccount: 'target2',
      externalId: 'ext2',
      amount: 200,
      currency: 'USD',
      metadata: { key: 'value2' },
      createdAt: new Date(),
      updatedAt: new Date(),
      processedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockTransaction: CreateTransactionDto = {
      sourceAccount: 'source123',
      targetAccount: 'target123',
      externalId: 'ext123',
      amount: 100,
      currency: 'USD',
      metadata: { key: 'value' },
    };

    const mockSavedTransaction: Transaction = {
      ...mockTransaction,
      id: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
      processedAt: new Date(),
    };

    it('should create and return a transaction', async () => {
      mockRepository.save.mockResolvedValue(mockSavedTransaction);

      const result = await service.create(mockTransaction);

      expect(repository.save).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockSavedTransaction);
    });
  });

  describe('bulkInsert', () => {
    it('should insert multiple transactions', async () => {
      await service.bulkInsert(mockTransactions);

      expect(repository.insert).toHaveBeenCalledWith(mockTransactions);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      mockRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
    });
  });
}); 