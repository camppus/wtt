import { Inject, Injectable } from '@nestjs/common';
import type UserRepo from '../../domain/repositories/UserRepo';
import { UserDto } from '../../domain/entities/User';
import Id from '@/shared/entities/Id';

@Injectable()
export default class ToogleUserUseCase {
  constructor(
    @Inject('UserRepo')
    private readonly repo: UserRepo,
  ) {}

  public async handle(id: Id): Promise<UserDto> {
    const user = await this.repo.getById(id);
    if (!user) {
      throw new Error('user Not found');
    }
    user.toogleStatus();
    await this.repo.save(user);
    return user.toEnttie() as UserDto;
  }
}
