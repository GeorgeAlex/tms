import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['x-api-key'];

    if (!key || typeof key !== 'string') {
      throw new UnauthorizedException('API key not provided');
    }

    const isValid = await this.apiKeyService.validate(key);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}