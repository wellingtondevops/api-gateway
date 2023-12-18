import {Module} from '@nestjs/common'
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoriasController } from './categorias.controlller';
import { CategoriasService } from './categorias.service';




@Module({
    imports:[ProxyRMQModule],
    controllers:[CategoriasController],
    providers: [CategoriasService]

})

export class CategoriasModule{}


