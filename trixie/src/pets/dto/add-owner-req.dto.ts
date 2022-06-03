import { IsEmail, IsMongoId, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

interface IOwnerEmailDto {
  ownerEmail: string;
}

@InputType()
export class AddOwnerReqDto implements IOwnerEmailDto {
  @IsEmail()
  @Field()
  readonly ownerEmail: string;
  @IsMongoId()
  @IsString()
  @Field()
  readonly petId: string;
}
