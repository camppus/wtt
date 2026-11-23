import { Inject, Injectable } from '@nestjs/common';
import type UserRepo from '../../domain/repositories/UserRepo';
import { UserDto } from '../../domain/entities/User';
import { PaginationInput, Pagination } from '@/shared/types';

@Injectable()
export default class GetUsersUseCase {
  constructor(
    @Inject('UserRepo')
    private readonly repo: UserRepo,
  ) {}

  public async handle(
    pagination: PaginationInput,
  ): Promise<Pagination<Omit<UserDto, 'password'>>> {
    const users = await this.repo.getAll(pagination);

    const mappedUsers = users.data.map((u) => {
      return u.toEnttie();
    });

    return {
      ...users,
      data: mappedUsers,
    };
  }
}
