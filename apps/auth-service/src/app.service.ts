import { Injectable } from '@nestjs/common';
import { greet } from '@repo/common';

@Injectable()
export class AppService {
  getHello(): string {
    return greet('Nest.js Service');
  }
}
