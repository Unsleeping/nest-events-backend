import { Type } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export function Paginated<T>(classRef: Type<T>) {
  @ObjectType()
  class PaginationResult<T> {
    @Expose()
    @Field({ nullable: true })
    first: number;

    @Expose()
    @Field({ nullable: true })
    last: number;

    @Expose()
    @Field({ nullable: true })
    limit: number;

    @Expose()
    @Field({ nullable: true })
    total?: number;

    @Expose()
    @Field(() => [classRef], { nullable: true })
    data: T[];

    constructor(partial: Partial<PaginationResult<T>>) {
      Object.assign(this, partial);
    }
  }

  return PaginationResult<T>;
}

export async function paginate<T, K>(
  qb: SelectQueryBuilder<T>,
  classRef: Type<K>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  },
): Promise<K> {
  const offset = (options.currentPage - 1) * options.limit;
  const data = await qb.offset(offset).limit(options.limit).getMany();

  // if we use here plain object, not a class, it's impossible to tell serializer which fields should be exposed
  return new classRef({
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options.total ? await qb.getCount() : null,
    data,
  });
}
