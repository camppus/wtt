import { Inject, Injectable } from '@nestjs/common';
import type UserRepo from '../../domain/repositories/UserRepo';
import User, { UserDto } from '../../domain/entities/User';
import Id from '@/shared/entities/Id';

@Injectable()
export default class GetUserByIdUseCase {
  constructor(
    @Inject('UserRepo')
    private readonly repo: UserRepo,
  ) {}

  public async handle(id: Id): Promise<UserDto> {
    const user = await this.repo.getById(id);

    if (!user) {
      throw new Error('user Not found');
    }

    return user.toEnttie() as UserDto;
  }

  public async getEntitie(id: Id): Promise<User> {
    const user = await this.repo.getById(id);

    if (!user) {
      throw new Error('user Not found');
    }

    return user;
  }
}
