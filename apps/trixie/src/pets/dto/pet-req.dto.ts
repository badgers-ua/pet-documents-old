import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Max,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  numberedEnumValueLength,
  numberTransformFormatter,
} from 'src/utils/formatter.utils';
import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { GENDER, SPECIES } from '@pdoc/types';

const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

@InputType()
export class PetReqDto {
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @Field()
  readonly name: string;

  @Transform(numberTransformFormatter)
  @Max(numberedEnumValueLength(SPECIES))
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  readonly species: SPECIES;

  @IsMongoId()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly breed?: string;

  @Transform(numberTransformFormatter)
  @Max(numberedEnumValueLength(GENDER))
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  readonly gender?: GENDER;

  @IsOptional()
  @Field(() => GraphQLISODateTime, { nullable: true })
  readonly dateOfBirth?: string;

  @MaxLength(20)
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly colour?: string;

  @MaxLength(140)
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly notes?: string;

  @Transform(numberTransformFormatter)
  @Max(100)
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  readonly weight?: number;

  // TODO: avatar
  @Field(() => GraphQLUpload, { nullable: true })
  readonly avatar?: any;
}

@InputType()
export class PatchPetReqDto extends PetReqDto {
  @IsMongoId()
  @IsString()
  @Field()
  _id: string;
}
