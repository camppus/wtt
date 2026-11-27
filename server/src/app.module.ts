import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import DatabaseModule from './infra/database';
import { ScheduleModule } from '@nestjs/schedule';
import UserModule from './modules/users/infra/http/userModule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import PaymentGetawayModule from './modules/transactions/infra/getaway';
import TransactionModule from './modules/transactions/infra/http/transactionModule';
import GameModule from './modules/games/GameModule';
import SMSModule from './infra/SMS';
import ConversationModule from './modules/conversations/ConversationModule';
import SecurityModule from './infra/security';
import AuthModule from './modules/auth/authModule';
import AuthMiddleware from './modules/auth/infra/http/authMiddleware';
import { CacheModule } from './infra/caching';
import NotificationModule from './modules/notification/notificationModule';
import BetModule from './modules/bets/betModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        return config;
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10,
          ttl: 60,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      delimiter: '.',
      global: true,
      maxListeners: 20,
    }),
    SecurityModule,
    DatabaseModule,
    UserModule,
    TransactionModule,
    PaymentGetawayModule,
    GameModule,
    SMSModule,
    ConversationModule,
    AuthModule,
    CacheModule,
    NotificationModule,
    BetModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'auth/(.*)',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
