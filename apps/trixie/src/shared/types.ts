import { Field, ObjectType } from '@nestjs/graphql';
import { IOwner } from '@pdoc/types';

@ObjectType()
export class Owner implements IOwner {
  @Field()
  _id: string;
  @Field()
  email?: string;
  @Field()
  name?: string;
  @Field()
  avatar?: string;
}
