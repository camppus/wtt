import Entity from '@/shared/entities/Entiry';
import Name from './Name';
import { PhoneNumber } from './PhoneNumber';
import Money from '@/shared/entities/Money';
import Id from '@/shared/entities/Id';
import { UserRole } from '@prisma/client';

export interface UserDto {
  id: string;
  name: Name;
  phone: PhoneNumber;
  password: string;
  balance: Money;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}
export default class User extends Entity {
  constructor(private readonly props: UserDto) {
    const id = new Id(props.id);
    super(id, props.createdAt, props.updatedAt);
  }

  public getName() {
    return this.props.name;
  }

  public getPassword() {
    return this.props.password;
  }

  public getPhone() {
    return this.props.phone;
  }
  public getbalance() {
    return this.props.balance;
  }

  public isActive() {
    return this.props.isActive;
  }

  public isAdmin() {
    return this.props.role === UserRole.ADMIN;
  }
  public changeName(name: Name) {
    this.props.name = name;
    this.touch();
  }
  public changeBalance(balance: Money) {
    this.props.balance = balance;
    this.touch();
  }

  public changePhone(phone: PhoneNumber) {
    this.props.phone = phone;
    this.touch();
  }

  public toogleStatus() {
    this.props.isActive = !this.props.isActive;
    this.touch();
  }

  public getRole() {
    return this.props.role;
  }

  public toEnttie(): Omit<UserDto, 'password'> {
    const { balance, createdAt, id, isActive, name, phone, updatedAt, role } =
      this.props;
    return {
      balance,
      createdAt,
      id,
      name,
      phone,
      updatedAt,
      isActive,
      role,
    };
  }
}
