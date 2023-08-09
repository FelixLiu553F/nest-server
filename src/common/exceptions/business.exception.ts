import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  public frontendMessage: string;

  constructor(message: string, status?: number, frontendMessage?: string) {
    super(message, status);
    this.frontendMessage = frontendMessage;
  }
}
