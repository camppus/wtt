import { Inject, Injectable } from '@nestjs/common';
import type WidthDrawlRepo from '../../domain/repositories/WidthdrawalRepo';
import { PaginationInput } from '@/shared/types';
import Id from '@/shared/entities/Id';

@Injectable()
export default class GetWidthrawlsUseCase {
  constructor(
    @Inject('WidthDrawlRepo')
    private readonly repo: WidthDrawlRepo,
  ) {}

  public async getAll(dto: {
    pagination: PaginationInput;
    userId: Id;
    isAdmin: boolean;
  }) {
    const { isAdmin, pagination, userId } = dto;
    if (isAdmin) {
      const response = await this.repo.getWidhdrawsls(pagination);
      return {
        ...response,
        data: response.data.map((item) => {
          item.toEntitie();
        }),
      };
    }
    const response = await this.repo.getWidhdrawslsByUserid(pagination, userId);
    return {
      ...response,
      data: response.data.map((item) => {
        item.toEntitie();
      }),
    };
  }

  public async getById(dto: { id: Id; userId: Id; isAdmin: boolean }) {
    const { id, isAdmin, userId } = dto;
    const widthdrawls = await this.repo.getById(id);

    if (!widthdrawls) {
      throw new Error('Widthdrawls not found');
    }

    if (!isAdmin && !widthdrawls.belongsTo(userId)) {
      throw new Error('Access danied');
    }
    return {
      data: widthdrawls.toEntitie(),
    };
  }
}
