import { Global, Module } from '@nestjs/common';
import Token from './token';
import Encript from './encript';
import { Hasher } from './hasher';

@Global()
@Module({
  providers: [Token, Encript, Hasher],
  exports: [Token, Encript, Hasher],
})
export default class SecurityModule {}
