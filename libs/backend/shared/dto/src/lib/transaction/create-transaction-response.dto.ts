import { Field } from '@nestjs/graphql';

import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateTransactionResponseDto {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
