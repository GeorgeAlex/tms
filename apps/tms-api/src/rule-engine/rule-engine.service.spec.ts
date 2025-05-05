import { Test, TestingModule } from '@nestjs/testing';
import { RuleEngineService } from './rule-engine.service';
import { CreateTransactionDto } from '@dotfile-tms/dto';

describe('RuleEngineService', () => {
  let service: RuleEngineService;
  const mockDate = new Date('2024-01-01T12:00:00Z');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleEngineService],
    }).compile();

    service = module.get<RuleEngineService>(RuleEngineService);

    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('processTransaction', () => {
    const mockTransaction: CreateTransactionDto = {
      sourceAccount: 'source123',
      targetAccount: 'target123',
      externalId: 'ext123',
      amount: 100,
      currency: 'USD',
      metadata: { key: 'value' },
    };

    it('should process a transaction and add processedAt timestamp', async () => {
      const result = await service.processTransaction(mockTransaction);

      expect(result).toEqual({
        ...mockTransaction,
        processedAt: mockDate,
      });
    });
  });
});
