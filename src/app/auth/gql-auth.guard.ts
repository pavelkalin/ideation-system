import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * This is a Guard Class for GraphQL, which extends the NestJS Passport AuthGuard.
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  /**
   * A method to get the request object of the current context. It also attaches arguments
   * from the current GraphQL context to the request body.
   * @param {ExecutionContext} context - The current execution context
   * @returns the modified request object
   */
  getRequest(context: ExecutionContext) {
    // create GqlExecutionContext from the current context
    const ctx = GqlExecutionContext.create(context);
    // get the request from the context
    const req = ctx.getContext();
    // attach the loginUserInput from GqlExecutionContext Args to the request body
    req.body = ctx.getArgs().loginUserInput;

    // return the modified request object
    return req;
  }
}
