import { CreateTransactionDto, TransactionDto } from "@dotfile-tms/dto";
import { Injectable } from "@nestjs/common";
import { instanceToPlain, plainToInstance } from "class-transformer";

@Injectable()
export class RuleEngineService {
    async processTransaction(transaction: CreateTransactionDto): Promise<TransactionDto> {
        const transactionData = instanceToPlain(transaction);

        transactionData.processedAt = new Date();

        return plainToInstance(TransactionDto, transactionData);
    }
}