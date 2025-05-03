import { Injectable } from "@nestjs/common";
import { CreateTransactionDto, TransactionDto } from "@dotfile-tms/dto";
import { instanceToPlain, plainToInstance } from "class-transformer";

@Injectable()
export class RuleEngineService {
    async processTransaction(transaction: CreateTransactionDto): Promise<TransactionDto> {
        const transactionData = instanceToPlain(transaction);

        transactionData.processedAt = new Date();

        return plainToInstance(TransactionDto, transactionData);
    }
}