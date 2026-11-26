import { Module } from '@nestjs/common';
import { UserController } from './userController';
import CreateUserUseCase from '../../application/usecases/createUserUseCase';
import UpdateUserUseCase from '../../application/usecases/updateUserUseCase';
import GetUserByIdUseCase from '../../application/usecases/getUserByIdUseCase';
import GetUsersUseCase from '../../application/usecases/getUsersUseCase';
import ToogleUserUseCase from '../../application/usecases/toogleuserUseCase';
import PrismaUserRepository from '../persistence/PrismaUserRepository';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserByIdUseCase,
    GetUsersUseCase,
    ToogleUserUseCase,
    {
      provide: 'UserRepo',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    'UserRepo',
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserByIdUseCase,
    GetUsersUseCase,
    ToogleUserUseCase,
  ],
  imports: [],
})
export default class UserModule {}
