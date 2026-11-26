import Id from '@/shared/entities/Id';
import { Pagination, PaginationInput } from '@/shared/types';
import { PhoneNumber } from '../entities/PhoneNumber';
import User from '../entities/User';

export default interface UserRepo {
  save(user: User): Promise<void>;
  getById(id: Id): Promise<User | null>;
  getAdmin(): Promise<User | null>;
  getAll(pagination: PaginationInput): Promise<Pagination<User>>;
  getByPhone(phone: PhoneNumber): Promise<User | null>;
  updatePassword(userId: Id, password: string): Promise<void>;
}
