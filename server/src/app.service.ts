import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class AppService {
  getHello(): string {
    dotenv.config(); // .env 파일 로드

    console.log(process.env.DB_PORT);
    return 'Hello World!';
  }
}
