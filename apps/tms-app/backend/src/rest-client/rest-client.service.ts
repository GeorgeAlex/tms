import { Injectable, HttpException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CreateTransactionDto, TransactionDto } from '@dotfile-tms/dto';
import { StatusCodes } from 'http-status-codes';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RestClientService {
  constructor(private readonly http: HttpService) {}

  async listTransactions(): Promise<TransactionDto[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<TransactionDto[]>('/transactions')
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        `Failed to fetch transactions: ${err.message}`,
        err.response?.status || StatusCodes.BAD_GATEWAY,
      );
    }
  }

  async createTransaction(input: CreateTransactionDto): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<TransactionDto>('/transactions', input)
      );
    } catch (err) {
      throw new HttpException(
        `Failed to create transaction: ${err.message}`,
        err.response?.status || StatusCodes.BAD_GATEWAY,
      );
    }
  }
}