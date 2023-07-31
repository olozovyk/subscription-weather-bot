import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpService {
  private logger = new Logger(HttpService.name);

  async get<T>(url: string): Promise<T | void> {
    try {
      const response = await axios(url);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
    }
  }
}
