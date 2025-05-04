import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Maybe split Database & DataModel - E-23
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { databaseConfig } from './config/database.config';
import { getOrmConfig, GetOrmConfigParam } from './config/ormconfig';
import { EntitiesModule } from './entities/entities.module';

@Module({})
export class DatabaseModule {
  public static register({
    migrations,
    forceDropSchema,
  }: Omit<GetOrmConfigParam, 'baseConfig' | 'logger'> = {}): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) =>
            getOrmConfig({
              baseConfig:
                configService.get<DataSourceOptions>('databaseConfig'),
              migrations,
              forceDropSchema,
            }),
          imports: [ConfigModule],
          inject: [ConfigService],
        }),
        EntitiesModule,
      ],
    };
  }
}
