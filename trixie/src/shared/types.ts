import { Field, ObjectType } from '@nestjs/graphql';

export enum SPECIES {
  CAT,
  DOG,
}

export enum GENDER {
  MALE,
  FEMALE,
}

@ObjectType()
export class Owner {
  @Field()
  _id: string;
  @Field()
  email?: string;
  @Field()
  name?: string;
  @Field()
  avatar?: string;
}
