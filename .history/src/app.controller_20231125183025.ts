import { Controller, Get, Logger } from '@nestjs/common';


@Controller('api/vi')
export class AppController {

  private logger = new Logger(AppController.name)
  constructor() {}

 
}
