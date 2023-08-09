import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { RedisService } from 'src/common/microservices/redis/redis.service';
import { CurrentUser } from 'src/common/decorators/currentUser';
import { User } from 'src/models/user.model';
import prisma from 'prisma/prisma';

@Controller('api/load')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  @Post('logout')
  @ApiOperation({ summary: '登出' })
  async logout(@CurrentUser() user: User): Promise<boolean> {
    await this.redisService.CacheCleaners.userSession(user.id);
    return true;
  }

  @Post('pwd-login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '密码登录' })
  async pwdLogin(@Req() req: Request): Promise<string> {
    return this.authService.login(req['user']);
  }

  @Post('signup-by-mobile')
  @ApiOperation({ summary: '邮件注册' })
  async signupByEmail(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('nickname') nickname: string,
    @Body('password') password: string,
  ) {
    await this.authService.verifyEmailCode(email, code);
    const user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      throw new Error('该邮箱已被注册');
    }
    await this.authService.createUser({
      mobilePhoneNumber: null,
      username: email,
      mobilePhoneVerified: false,
      nickname: nickname,
      password,
      avatar: null,
      emailVerified: true,
      email,
    });

    return true;
  }
}
