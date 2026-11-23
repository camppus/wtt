import { Inject, Injectable } from '@nestjs/common';
import type UserRepo from '../../domain/repositories/UserRepo';
import { CreateUserDto } from '../dto/createUserDto';
import { PhoneNumber } from '../../domain/entities/PhoneNumber';
import Name from '../../domain/entities/Name';
import Password from '../../domain/entities/Password';
import { Hasher } from '@/infra/security/hasher';
import { PhoneInUseError } from '../../domain/exceptions';
import User, { UserDto } from '../../domain/entities/User';
import Money from '@/shared/entities/Money';
import Id from '@/shared/entities/Id';

@Injectable()
export default class CreateUserUseCase {
  constructor(
    @Inject('UserRepo')
    private readonly repo: UserRepo,
    private readonly hasher: Hasher,
  ) {}

  public async handle(dto: CreateUserDto): Promise<UserDto> {
    const phone = new PhoneNumber(dto.phone);
    const name = new Name(dto.name);
    const password = new Password(dto.password);
    const passwordHash = this.hasher.hash(password);
    const userWithPhone = await this.repo.getByPhone(phone);

    if (userWithPhone) {
      throw new PhoneInUseError();
    }

    const now = new Date();
    const user = new User({
      balance: new Money(0),
      createdAt: now,
      id: Id.generate().getValue(),
      isActive: true,
      name,
      password: passwordHash,
      phone,
      updatedAt: now,
      role: 'CLIENT',
    });

    return user.toEnttie() as UserDto;
  }
}
