import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

interface Result {
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get()
  // getHello(@Res() response): string {
  //   return response.json({ message: this.appService.getHello() });
  // }

  @Get()
  getHello(): Result {
    const result: Result = {
      message: this.appService.getHello()
    }
    return result;
  }
}
