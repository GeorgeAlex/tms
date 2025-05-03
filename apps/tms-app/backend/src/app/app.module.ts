import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RestClientService } from '../rest-client/rest-client.service';
import { TransactionsResolver } from '../transaction/transaction.resolver';


@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.DOTFILE_API_URL || 'http://localhost:3000/api',
      timeout: 5000,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  providers: [RestClientService, TransactionsResolver],
})

export class AppModule {}