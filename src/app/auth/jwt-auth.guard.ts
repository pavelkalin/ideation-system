import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Overrides the getRequest method of the base AuthGuard to extract the request
   * out of the GraphQL ExecutionContext.
   *
   * NestJS defaults to a request-response model flow so in a GraphQL context,
   * we need to extract the request from the execution context.
   *
   * @param {ExecutionContext} context - The ExecutionContext instance.
   * @returns {Request} - The request object from the ExecutionContext.
   */
  getRequest(context: ExecutionContext) {
    // Create a GqlExecutionContext instance to shift from HTTP to GQL context.
    const ctx = GqlExecutionContext.create(context);
    // Extract and return the request from the GQL context.
    return ctx.getContext().req;
  }
}
