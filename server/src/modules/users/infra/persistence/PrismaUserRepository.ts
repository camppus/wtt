import { Injectable } from '@nestjs/common';
import UserRepo from '../../domain/repositories/UserRepo';
import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';
import { PhoneNumber } from '../../domain/entities/PhoneNumber';
import User from '../../domain/entities/User';
import PrimaService from '@/infra/database/Prisma/prisma.service';
import { User as PrismaUser } from '@prisma/client';
import Name from '../../domain/entities/Name';
import Money from '@/shared/entities/Money';
import { getPagination } from '@/shared/lib';

@Injectable()
export default class PrismaUserRepository implements UserRepo {
  constructor(private readonly prisma: PrimaService) {}
  public async updatePassword(userId: Id, password: string): Promise<void> {
    await this.prisma.user.update({
      data: {
        password,
      },
      where: {
        id: userId.getValue(),
      },
    });
  }

  public async save(user: User): Promise<void> {
    const userName = user.toEnttie().name;
    const name =
      userName.getName().firstName + ' ' + userName.getName().lastName;
    await this.prisma.user.upsert({
      create: {
        name,
        password: user.getPassword(),
        phone: user.getPhone().getValue(),
        balance: 0,
        id: user.getId().getValue(),
        isActive: user.isActive(),
        role: user.getRole(),
      },
      update: {
        name,
        phone: user.getPhone().getValue(),
        balance: user.getbalance().getValue(),
        isActive: user.isActive(),
      },
      where: {
        id: user.getId().getValue(),
      },
    });
  }

  public async getById(id: Id): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id.getValue(),
      },
    });

    if (!user) {
      return null;
    }
    return this.toEntitie(user);
  }
  public async getAdmin(): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (!user) {
      return null;
    }
    return this.toEntitie(user);
  }

  public async getAll(pagination: PaginationInput): Promise<Pagination<User>> {
    const { limit, page, skip, take } = getPagination(pagination);
    const [total, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        take,
        skip,
      }),
    ]);

    const mappedUsers = users.map((u) => {
      return this.toEntitie(u);
    });

    const lastPage = Math.ceil(total / limit);
    return {
      currentPage: page,
      data: mappedUsers,
      lastPage,
      limit: limit,
      total,
    };
  }

  public async getByPhone(phone: PhoneNumber): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: phone.getValue(),
      },
    });

    if (!user) {
      return null;
    }
    return this.toEntitie(user);
  }

  private toEntitie(prismaUser: PrismaUser): User {
    console.log(prismaUser);
    const phone = new PhoneNumber(prismaUser.phone);
    const name = new Name(prismaUser.name);
    const balance = new Money(prismaUser.balance.toNumber());
    const user = new User({
      balance,
      createdAt: prismaUser.createdAt,
      id: Id.generate().getValue(),
      isActive: true,
      name,
      password: prismaUser.password,
      phone,
      updatedAt: prismaUser.updatedAt,
      role: prismaUser.role,
    });

    return user;
  }
}
