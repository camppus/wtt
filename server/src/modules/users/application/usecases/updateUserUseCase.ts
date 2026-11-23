import { Inject, Injectable } from '@nestjs/common';
import type UserRepo from '../../domain/repositories/UserRepo';
import { UserDto } from '../../domain/entities/User';
import Id from '@/shared/entities/Id';
import { UserNotFound } from '@/execptions/user.error';
import { UpdatUserDto } from '../dto/updateUserDto';
import { PhoneNumber } from '../../domain/entities/PhoneNumber';
import Name from '../../domain/entities/Name';
import { PhoneInUseError } from '../../domain/exceptions';

@Injectable()
export default class UpdateUserUseCase {
  constructor(
    @Inject('UserRepo')
    private readonly repo: UserRepo,
  ) {}

  public async handle(id: Id, dto: UpdatUserDto): Promise<UserDto> {
    const phone = new PhoneNumber(dto.phone);
    const name = new Name(dto.name);
    const [user, userWithPhone] = await Promise.all([
      this.repo.getById(id),
      this.repo.getByPhone(phone),
    ]);

    if (userWithPhone && userWithPhone.getId().getValue() !== id.getValue()) {
      throw new PhoneInUseError();
    }

    if (!user) {
      throw new UserNotFound();
    }
    user.changeName(name);
    user.changePhone(phone);
    await this.repo.save(user);
    return user.toEnttie() as UserDto;
  }
}
