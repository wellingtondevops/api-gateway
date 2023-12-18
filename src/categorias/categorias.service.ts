import { Injectable } from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/cliente-proxy';
import { TOPICS } from 'src/common/environment/environments';


@Injectable()
export class CategoriasService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  criarCategoria(criarCategoriaDto: CriarCategoriaDto) {
    this.clientAdminBackend.emit(TOPICS.CRIAR_CATEGORIA, criarCategoriaDto);
  }

  async consultarCategorias(_id: string): Promise<any> {
    return await this.clientAdminBackend
      .send(TOPICS.CONSULTAR_CATEGORIAS, _id ? _id : '')
      .toPromise();
  }

  atualizarCategoria(
    atualizarCategoriaDto: AtualizarCategoriaDto,
    _id: string,
  ) {
    this.clientAdminBackend.emit(TOPICS.ATUALIZAR_CATEGORIA, {
      id: _id,
      categoria: atualizarCategoriaDto,
    });
  }
}

