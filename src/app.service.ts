import type { OnApplicationBootstrap } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { UserService } from './modules/user/user.service';

@Injectable()
export class ApplicationService implements OnApplicationBootstrap {
  constructor(private readonly userService: UserService) {}

  async onApplicationBootstrap() {
    await this.userService.createDefaultUser();
  }
}
