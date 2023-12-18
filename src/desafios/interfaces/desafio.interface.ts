import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { DesafioStatus } from '../desafio-status.enum';
import { Partida } from './partida.interface';



export interface Desafio extends Document {

    dataHoraDesafio: Date
    status: DesafioStatus
    dataHoraSolicitacao: Date
    dataHoraResposta: Date
    solicitante: Jogador
    categoria: string
    jogadores: Array<Jogador>
    partida?: Partida  
}

