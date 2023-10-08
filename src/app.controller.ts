import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('stock')
  getHello(): Promise<any> {
    return this.appService.getStock()
  }

  @Get('news')
  getNews(): any {
    return this.appService.getNews()
  }

  @Get('contacts')
  getContact(): any {
    return this.appService.getContact()
  }
}
