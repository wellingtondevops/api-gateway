import { Controller, Get, Logger } from '@nestjs/common';
import { ClientGrpcProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';


@Controller('api/vi')
export class AppController {

  private logger = new Logger(AppController.name)
  private clienteAdminBackent : ClientProxyFactory
  constructor() {
    this.clienteAdminBackent = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options:{
        urls:["amqp://archio:archio@localhost:5672/smartranking"]
      }
    })
  }

 
}
