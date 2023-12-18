import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientGrpcProxy, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';


@Controller('api/v1')
export class AppController {

  private logger = new Logger(AppController.name)
  private clienteAdminBackent: ClientProxy
  constructor() {
    this.clienteAdminBackent = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://archio:archio@localhost:5672/smartranking"],
        queue: 'admin-backend'
      }
    })
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body()criarCategoria: CriarCategoriaDto){
      return await this.clienteAdminBackent.emit('criar-categoria',criarCategoria)


  }




}
