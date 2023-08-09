import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { nanoid } from 'nanoid';
import prisma from 'prisma/prisma';
import {
  RedisService,
  serialize,
  redisClient as redis,
} from 'src/common/microservices/redis/redis.service';
import { md5 } from 'src/common/utils/passport.util';
import { SESSION_EXPIRES } from 'src/configs/redis.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  private async clearUserCache(userId: string) {
    await this.redisService.CacheCleaners.userFolderRoleMap([userId]);
  }

  async localValidate(username: string, password: string): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobilePhoneNumber: username, mobilePhoneVerified: true },
          { username },
          { email: username, emailVerified: true },
        ],
        password: { in: [password, md5(password)] },
      },
      include: { userRoles: true },
    });

    if (!user || !password) {
      throw new Error('用户名或密码错误');
    }

    return user;
  }

  async login(user: User) {
    const token = this.jwtService.sign(
      this.redisService.CacheKeys.genUserSessionToken(user.id),
    );

    await Promise.all([
      redis.set(
        this.redisService.CacheKeys.userSession(token),
        serialize(user),
        'EX',
        SESSION_EXPIRES,
      ),
      this.clearUserCache(user.id),
    ]);

    return token;
  }

  async verifyEmailCode(email: string, code: string) {
    const key = this.redisService.CacheKeys.emailVerifyCode(
      Buffer.from(email.trim(), 'base64').toString(),
    );

    const value = await redis.get(key);

    if (value) {
      if (value === code) {
        return true;
      }

      throw new Error('验证码错误');
    }

    throw new Error('验证码已过期');
  }

  async createUser(
    info: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  ) {
    const userId = info.id ?? nanoid();

    const newUser = await prisma.user.create({
      data: {
        ...info,
        id: userId,
        nickname: info.nickname ?? nanoid(5),
      },
      include: { userRoles: true },
    });

    return newUser;
  }
}
