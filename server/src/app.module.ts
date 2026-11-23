import {
  Logger,
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
import { ChatModule } from './modules/chats/chat.module';
import TransactionModule from './modules/transactions/infra/http/transactionModule';
import GameModule from './modules/games/GameModule';
import SMSModule from './infra/SMS';
import AuthMiddleare from './infra/http/middlewares/auth.middleware';

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
    DatabaseModule,
    UserModule,
    BetsModule,
    ChatModule,
    TransactionModule,
    PaymentGetawayModule,
    GameModule,
    SMSModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  private readonly loggger = new Logger(AppModule.name);
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleare)
      .exclude('auth')
      .exclude({
        path: '/users',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
