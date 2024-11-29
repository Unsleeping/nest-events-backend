import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    GqlArgumentsHost.create(host); // to convert ArgumentsHost to GqlArgumentsHost

    return new NotFoundException('Entity not found');
  }
}
