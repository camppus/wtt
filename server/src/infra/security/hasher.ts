import Password from '@/modules/users/domain/entities/Password';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class Hasher {
  hash(text: Password) {
    return bcrypt.hashSync(text.getValue(), 10);
  }

  public compare(hash: string, text: Password) {
    return bcrypt.compareSync(text.getValue(), hash);
  }
}
