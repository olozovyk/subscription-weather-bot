import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { logCaughtError } from '../common/utils';

@Injectable()
export class HttpService {
  private logger = new Logger(HttpService.name);

  async get<T>(url: string): Promise<T | void> {
    try {
      const response = await axios(url);
      return response.data;
    } catch (e) {
      logCaughtError(e, this.logger);
    }
  }
}
