import { Inject, Injectable } from '@nestjs/common';
import Id from '@/shared/entities/Id';
import type WidthDrawlRepo from '../../domain/repositories/WidthdrawalRepo';
import ToogleWidthdralwsDto from '../dto/toogleWidthDralwsDto';
import type UserRepo from '@/modules/users/domain/repositories/UserRepo';
import GetUserByIdUseCase from '@/modules/users/application/usecases/getUserByIdUseCase';
import Money from '@/shared/entities/Money';

@Injectable()
export default class ToggleWidthDrawlsUseCase {
  constructor(
    @Inject('WidthDrawlRepo')
    private readonly repo: WidthDrawlRepo,
    private readonly getUserUc: GetUserByIdUseCase,
    @Inject('UserRepo')
    private readonly userRepo: UserRepo,
  ) {}

  public async handle(dto: ToogleWidthdralwsDto & { userId: Id; id: Id }) {
    const { status, fileUrl, id, userId, note } = dto;
    const [widthdrawls, user] = await Promise.all([
      this.repo.getById(id),
      this.getUserUc.getEntitie(userId),
    ]);

    if (!widthdrawls) {
      throw new Error('Widthdrawls not found');
    }
    widthdrawls.anextTo(userId);
    if (status) {
      widthdrawls.approve(fileUrl!);
      widthdrawls.setNotes('Pedido de saque aprovado pela equipe');
      const balance = new Money(
        user.getbalance().getValue() -
          widthdrawls.toEntitie().amount.getValue(),
      );
      user.changeBalance(balance);
      await this.userRepo.save(user);
    } else {
      widthdrawls.fail();
      widthdrawls.setNotes(note!);
    }

    await this.repo.save(widthdrawls);
    return {
      data: widthdrawls.toEntitie(),
    };
  }
}
