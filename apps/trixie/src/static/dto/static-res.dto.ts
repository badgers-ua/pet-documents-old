import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StaticResDto {
  @Field()
  public _id: string;
  @Field()
  public name: string;

  constructor(_id: string, name: string) {
    this._id = _id;
    this.name = name;
  }
}
