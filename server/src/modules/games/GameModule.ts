import { Module } from '@nestjs/common';
import OddsApiService from './infra/machApi/providers/OddsApi';
import CreateGameUseCase from './application/usecase/CreateGameUseCase';
import GetGameUseCase from './application/usecase/GetGameUseCase';
import GetGamesUseCase from './application/usecase/GetGamesUseCase';
import UpdateGameUseCase from './application/usecase/UpdateGameUseCase';
import CloseGameUseCase from './application/usecase/CloseGameUseCase';
import SyncGamesJob from './infra/jobs/syncGamesJob';
import UpdateLiveGamesJob from './infra/jobs/UpdateLiveGamesJob';
import CloseGamesJob from './infra/jobs/closeGamesJob';
import GameController from './infra/http/gamesController';
import PrismaGameRepo from './infra/persistence/PrismaGameRepo';
@Module({
  controllers: [GameController],

  providers: [
    {
      provide: 'GameRepo',
      useClass: PrismaGameRepo,
    },

    {
      provide: 'IApiMatchService',
      useClass: OddsApiService,
    },

    CreateGameUseCase,
    GetGameUseCase,
    GetGamesUseCase,
    UpdateGameUseCase,
    CloseGameUseCase,
    SyncGamesJob,
    UpdateLiveGamesJob,
    CloseGamesJob,
  ],

  exports: [
    CreateGameUseCase,
    GetGameUseCase,
    GetGamesUseCase,
    UpdateGameUseCase,
    CloseGameUseCase,
    'GameRepo',
    'IApiMatchService',
  ],
})
export default class GameModule {}
