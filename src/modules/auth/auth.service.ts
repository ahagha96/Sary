import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

import type { UserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: UserDto): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, 12);
  }

  comparePasswords(
    newPassword: string,
    passwortHash: string,
  ): Promise<boolean> {
    return compare(newPassword, passwortHash);
  }
}
