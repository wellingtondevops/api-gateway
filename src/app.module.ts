import { Module } from '@nestjs/common';

import { CategoriasModule } from './categorias/categorias.module';
import { ClientProxySmartRanking } from './proxyrmq/cliente-proxy';
import { JogadoresModule } from './jogadores/jogadores.module';
import { GcpModule } from './gcp/gcp.module';
import {ConfigModule} from '@nestjs/config'
import { DesafiosModule } from './desafios/desafios.module';


@Module({
  imports: [
    CategoriasModule,
    JogadoresModule, 
    GcpModule,
    ConfigModule.forRoot({isGlobal:true}),
    DesafiosModule,
    
  ],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
