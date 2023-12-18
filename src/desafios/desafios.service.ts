import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';

import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { Desafio } from '../desafios/interfaces/desafio.interface';
import { DesafioStatus } from './desafio-status.enum';
import { Partida } from './interfaces/partida.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/cliente-proxy';
import { CriarDesafioDto } from './dtos/criar-desafios.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafios.dto';
import { TOPICS } from 'src/common/environment/environments';

@Injectable()
export class DesafiosService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private readonly logger = new Logger(DesafiosService.name);

  
  private clientDesafios = this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async criarDesafio(criarDesafioDto: CriarDesafioDto) {
    this.logger.log(`criarDesafioDto: ${JSON.stringify(criarDesafioDto)}`);

    const jogadores: Jogador[] = await this.clientAdminBackend
      .send('consultar-jogadores', '')
      .toPromise();

    criarDesafioDto.jogadores.map(jogadorDto => {
      const jogadorFilter: Jogador[] = jogadores.filter(
        jogador => jogador._id == jogadorDto._id,
      );

      this.logger.log(`jogadorFilter: ${JSON.stringify(jogadorFilter)}`);

      
      if (jogadorFilter.length == 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não é um jogador!`,
        );
      }

      if (jogadorFilter[0].categoria != criarDesafioDto.categoria) {
        throw new BadRequestException(
          `O jogador ${jogadorFilter[0]._id} não faz parte da categoria informada!`,
        );
      }
    });

    
    const solicitanteEhJogadorDaPartida: Jogador[] = criarDesafioDto.jogadores.filter(
      jogador => jogador._id == criarDesafioDto.solicitante,
    );

    this.logger.log(
      `solicitanteEhJogadorDaPartida: ${JSON.stringify(
        solicitanteEhJogadorDaPartida,
      )}`,
    );

    if (solicitanteEhJogadorDaPartida.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', criarDesafioDto.categoria)
      .toPromise();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    if (!categoria) {
      throw new BadRequestException(`Categoria informada não existe!`);
    }

    await this.clientDesafios.emit(TOPICS.CRIAR_DESAFIO, criarDesafioDto);
  }

  async consultarDesafios(idJogador: string): Promise<any> {
    
    if (idJogador) {
      const jogador: Jogador = await this.clientAdminBackend
        .send(TOPICS.CONSULTAR_JOGADORES, idJogador)
        .toPromise();
      this.logger.log(`jogador: ${JSON.stringify(jogador)}`);
      if (!jogador) {
        throw new BadRequestException(`Jogador não cadastrado!`);
      }
    }
    
    return this.clientDesafios
      .send(TOPICS.CONSULTAR_DESAFIOS, { idJogador: idJogador, _id: '' })
      .toPromise();
  }

  async atualizarDesafio(
    atualizarDesafioDto: AtualizarDesafioDto,
    _id: string,
  ) {

    const desafio: Desafio = await this.clientDesafios
      .send(TOPICS.CONSULTAR_DESAFIOS, { idJogador: '', _id: _id })
      .toPromise();

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    if (!desafio) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }

    if (desafio.status != DesafioStatus.PENDENTE) {
      throw new BadRequestException(
        'Somente desafios com status PENDENTE podem ser atualizados!',
      );
    }

    await this.clientDesafios.emit('atualizar-desafio', {
      id: _id,
      desafio: atualizarDesafioDto,
    });
  }

  async atribuirDesafioPartida(
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    _id: string,
  ) {
    const desafio: Desafio = await this.clientDesafios
      .send(TOPICS.CONSULTAR_DESAFIOS, { idJogador: '', _id: _id })
      .toPromise();

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    if (!desafio) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }


    if (desafio.status == DesafioStatus.REALIZADO) {
      throw new BadRequestException(`Desafio já realizado!`);
    }


    if (desafio.status != DesafioStatus.ACEITO) {
      throw new BadRequestException(
        `Partidas somente podem ser lançadas em desafios aceitos pelos adversários!`,
      );
    }

    
    if (!desafio.jogadores.includes(atribuirDesafioPartidaDto.def)) {
      throw new BadRequestException(
        `O jogador vencedor da partida deve fazer parte do desafio!`,
      );
    }

    
    const partida: Partida = {};
    partida.categoria = desafio.categoria;
    partida.def = atribuirDesafioPartidaDto.def;
    partida.desafio = _id;
    partida.jogadores = desafio.jogadores;
    partida.resultado = atribuirDesafioPartidaDto.resultado;

    await this.clientDesafios.emit('criar-partida', partida);
  }

  async deletarDesafio(_id: string) {
    const desafio: Desafio = await this.clientDesafios
      .send(TOPICS.CONSULTAR_DESAFIOS, { idJogador: '', _id: _id })
      .toPromise();

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    
    if (!desafio) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }

    await this.clientDesafios.emit(TOPICS.DELETAR_DESAFIO, desafio);
  }
}
