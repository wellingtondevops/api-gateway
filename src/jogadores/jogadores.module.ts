import {Module} from '@nestjs/common'
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';





@Module({
    imports:[ProxyRMQModule],
    controllers:[JogadoresController],
    providers: [JogadoresService]

})

export class JogadoresModule{}


