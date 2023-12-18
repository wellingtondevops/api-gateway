import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator"
import { Jogador } from "src/jogadores/interfaces/jogador.interface"



export class CriarDesafioDto{

@IsNotEmpty()
@IsDateString()
dataHoraDesafio: Date

@IsNotEmpty()
solicitante: string

@IsNotEmpty()
categoria: string

@IsArray()
@ArrayMinSize(2)
@ArrayMaxSize(3)
jogadores: Jogador[]


}