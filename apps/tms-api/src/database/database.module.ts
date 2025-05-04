
import { DatabaseModule } from '@dotfile-tms/database';
import { migrations } from '@dotfile-tms/migrations';
import { Module } from '@nestjs/common';

// @NOTE migrations will run at this API startup
@Module({
  imports: [DatabaseModule.register({ migrations })],
})
export class ApiDatabaseModule {}
