import { Module } from '@nestjs/common';
import BetController from './infra/http/betController';
import CreateBetSlipUseCase from './application/useCase/CreateBetSlipUseCase';
import GetBetByIdUseCase from './application/useCase/GetBetByIdUseCase';
import GetUserProgrationUseCase from './application/useCase/GetUserProgrationUseCase';
import ListBetsUseCase from './application/useCase/ListBetsUseCase';
import BetProgressService from './domain/service/betProgressService';
import PickResolveService from './domain/service/pickResolveService';
import ResolvePickService from './domain/service/resolvePickService';
import PrismaBetSlipRepository from './infra/persistence/PrismaBetSlipRepository';
import PrismaBettingProgressionRepository from './infra/persistence/PrismaBettingProgressionRepository';
import GameModule from '../games/GameModule';
import UserModule from '../users/infra/http/userModule';

@Module({
  imports: [GameModule, UserModule],
  controllers: [BetController],
  providers: [
    CreateBetSlipUseCase,
    GetBetByIdUseCase,
    GetUserProgrationUseCase,
    ListBetsUseCase,
    BetProgressService,
    PickResolveService,
    ResolvePickService,
    {
      provide: 'BetSlipRepository',
      useClass: PrismaBetSlipRepository,
    },
    {
      provide: 'BettingProgressionRepository',
      useClass: PrismaBettingProgressionRepository,
    },
  ],

  exports: [
    BetProgressService,
    'BetSlipRepository',
    'BettingProgressionRepository',
  ],
})
export default class BetModule {}
