import { CreateTransactionDto, TransactionDto } from '@dotfile-tms/dto';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bullmq';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { RuleEngineService } from '../rule-engine/rule-engine.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let ruleEngine: RuleEngineService;
  let queue: Queue;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const mockRuleEngineService = {
    processTransaction: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: RuleEngineService,
          useValue: mockRuleEngineService,
        },
        {
          provide: 'BullQueue_transaction-ingest',
          useValue: mockQueue,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
    ruleEngine = module.get<RuleEngineService>(RuleEngineService);
    queue = module.get<Queue>('BullQueue_transaction-ingest');
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

    it('should add transaction to queue', async () => {
      await controller.create(mockTransaction);
      expect(queue.add).toHaveBeenCalledWith('new-transaction', mockTransaction);
    });
  });

  describe('createInstant', () => {
    const mockTransaction: CreateTransactionDto = {
      sourceAccount: 'source123',
      targetAccount: 'target123',
      externalId: 'ext123',
      amount: 100,
      currency: 'USD',
      metadata: { key: 'value' },
    };

    const mockProcessedTransaction: TransactionDto = {
      ...mockTransaction,
      id: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
      processedAt: new Date(),
    };

    it('should process and create transaction synchronously', async () => {
      mockRuleEngineService.processTransaction.mockResolvedValue(mockProcessedTransaction);
      mockTransactionsService.create.mockResolvedValue(mockProcessedTransaction);

      const result = await controller.createInstant(mockTransaction);

      expect(ruleEngine.processTransaction).toHaveBeenCalledWith(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(mockProcessedTransaction);
      expect(result).toEqual(mockProcessedTransaction);
    });
  });

  describe('bulkCreate', () => {
    const mockTransactions: CreateTransactionDto[] = [
      {
        sourceAccount: 'source1',
        targetAccount: 'target1',
        externalId: 'ext1',
        amount: 100,
        currency: 'USD',
        metadata: { key: 'value1' },
      },
      {
        sourceAccount: 'source2',
        targetAccount: 'target2',
        externalId: 'ext2',
        amount: 200,
        currency: 'USD',
        metadata: { key: 'value2' },
      },
    ];

    it('should add multiple transactions to queue', async () => {
      await controller.bulkCreate(mockTransactions);
      
      expect(queue.add).toHaveBeenCalledTimes(2);
      mockTransactions.forEach((tx, index) => {
        expect(queue.add).toHaveBeenNthCalledWith(index + 1, 'new-transaction', tx);
      });
    });
  });

  describe('findAll', () => {
    const mockTransactions: TransactionDto[] = [
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

    it('should return all transactions', async () => {
      mockTransactionsService.findAll.mockResolvedValue(mockTransactions);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
    });
  });
}); 