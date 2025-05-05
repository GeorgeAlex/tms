import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { CreateTransactionDto } from '@dotfile-tms/dto';

describe('TMS API', () => {
  const mockTransaction: CreateTransactionDto = {
    sourceAccount: 'source123',
    targetAccount: 'target123',
    externalId: 'ext123',
    amount: 100,
    currency: 'USD',
    metadata: { key: 'value' }
  };

  const apiKey = process.env.API_KEY ?? 'test-api-key';
  const authorizationHeaders = { 'x-api-key': apiKey };

  describe('Authentication', () => {
    it('should reject requests without API key', async () => {
      await expect(axios.get('/transactions')).rejects.toMatchObject({
        status: StatusCodes.UNAUTHORIZED,
      });
    });

    it('should reject requests with invalid API key', async () => {
      await expect(axios.get('/transactions', {
        headers: { 'x-api-key': 'invalid-key' }
      })).rejects.toMatchObject({
        status: StatusCodes.UNAUTHORIZED,
      });
    });
  });

  describe('POST /transactions', () => {
    it('should accept a transaction asynchronously', async () => {
      const response = await axios.post('/transactions', mockTransaction, { headers: authorizationHeaders });
      expect(response.status).toBe(StatusCodes.ACCEPTED);
    });

    it('should validate transaction data', async () => {
      const invalidTransaction = { ...mockTransaction, amount: 'invalid' };

      await expect(axios.post('/transactions', invalidTransaction, { headers: authorizationHeaders })).rejects.toMatchObject({
        status: StatusCodes.BAD_REQUEST,
      });
    });
  });

  describe('POST /transactions/instant', () => {
    it('should create and process a transaction synchronously', async () => {
      const response = await axios.post('/transactions/instant', mockTransaction, { headers: authorizationHeaders });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.data).toMatchObject({
        ...mockTransaction,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        processedAt: expect.any(String)
      });
    });

    it('should validate transaction data', async () => {
      const invalidTransaction = { ...mockTransaction, amount: 'invalid' };

      await expect(axios.post('/transactions/instant', invalidTransaction, { headers: authorizationHeaders })).rejects.toMatchObject({
        status: StatusCodes.BAD_REQUEST,
      });
    });
  });

  describe('POST /transactions/bulk', () => {
    const bulkTransactions = [
      mockTransaction,
      {
        ...mockTransaction,
        externalId: 'ext124',
        amount: 200
      }
    ];

    it('should accept multiple transactions asynchronously', async () => {
      const response = await axios.post('/transactions/bulk', bulkTransactions, { headers: authorizationHeaders });

      expect(response.status).toBe(StatusCodes.ACCEPTED);
    });

    it('should validate all transactions in bulk request', async () => {
      const invalidBulkTransactions = [
        { ...mockTransaction, sourceAccount: 0 },
        { ...mockTransaction, amount: 'invalid' }
      ];

      await expect(axios.post('/transactions/bulk', invalidBulkTransactions, { headers: authorizationHeaders })).rejects.toMatchObject({
        status: StatusCodes.BAD_REQUEST,
      });
    });
  });

  describe('GET /transactions', () => {
    it('should return all transactions', async () => {
      const response = await axios.get('/transactions', { headers: authorizationHeaders });

      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.data)).toBe(true);

      const expectedTransactionStructure = {
        id: expect.any(String),
        sourceAccount: expect.any(String),
        targetAccount: expect.any(String),
        externalId: expect.any(String),
        amount: expect.any(Number),
        currency: expect.any(String),
        metadata: expect.any(Object),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        processedAt: expect.any(String)
      };

      response.data.forEach(transaction => {
        expect(transaction).toMatchObject(expectedTransactionStructure);
      });
    });
  });
});
