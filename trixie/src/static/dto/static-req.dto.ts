import { Transform } from 'class-transformer';
import {
  numberedEnumValueLength,
  numberTransformFormatter,
} from '../../utils/formatter.utils';
import { IsNumber, Max } from 'class-validator';
import { SPECIES } from '../../shared/types';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class StaticReqDto {
  @Transform(numberTransformFormatter)
  @Max(numberedEnumValueLength(SPECIES))
  @IsNumber()
  @Field(() => Int)
  species: SPECIES;
}
