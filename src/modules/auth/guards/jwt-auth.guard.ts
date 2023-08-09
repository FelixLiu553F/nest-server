import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
