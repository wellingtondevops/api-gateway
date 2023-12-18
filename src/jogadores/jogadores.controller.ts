import { BadGatewayException, BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ClientProxySmartRanking } from "src/proxyrmq/cliente-proxy";
import { CriarJogadorDto } from "./dtos/criar-jogador.dto";
import { Categoria } from "src/categorias/interfaces/categoria.interface";
import { Observable } from "rxjs";
import { AtualizarJogadorDto } from "./dtos/atualizar-jogador.dto";
import { ValidacaoParametrosPipe } from "src/common/pipes/validacao-parametros.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { GcpService } from "src/gcp/gcp.service";
import { TOPICS } from "src/common/environment/environments";




@Controller('api/v1/jogadores')
export class JogadoresController{

    private logger = new Logger(JogadoresController.name)

    constructor(
        private clientProxySmartRanking: ClientProxySmartRanking
    ){}

    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()
    private gcpUpload = new GcpService()

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(
        @Body() criarJogadorDto: CriarJogadorDto) {
  
        this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`)          
        
        const categoria: Categoria = await this.clientAdminBackend.send(TOPICS.CONSULTAR_CATEGORIAS, criarJogadorDto.categoria).toPromise()
  
        if (categoria) {
          await this.clientAdminBackend.emit(TOPICS.CRIAR_JOGADOR, criarJogadorDto)
        } else {
          throw new BadRequestException(`Categoria não cadastrada!`)
        }
    }

    @Get()
    consultarJogadores(
     @Query('idJogador') _id: string
      ): Observable<any> {    
    
      return this.clientAdminBackend.send(TOPICS.CONSULTAR_JOGADORES, _id ? _id: '')
 
    }
    @Post('/:_id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
      @UploadedFile() file,
      @Param('_id') _id:string){

        const jogador = await this.clientAdminBackend.send(TOPICS.CONSULTAR_JOGADORES,_id).toPromise()

        if(!jogador){
          throw new BadGatewayException('Jogador nao encontrado')
        }

        const urlFotoJogdor = await this.gcpUpload.uploadArquivo(file,_id)

        const atualizarJogadorDto:AtualizarJogadorDto = { }
        atualizarJogadorDto.urlFotoJogador = urlFotoJogdor.url
        await this.clientAdminBackend.emit(TOPICS.ATUALIZAR_JOGADOR,{id:_id, jogador:atualizarJogadorDto})

        return this.clientAdminBackend.send(TOPICS.CONSULTAR_JOGADORES,_id)
        

      }



    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() atualizarJogadorDto: AtualizarJogadorDto, 
        @Param('_id', ValidacaoParametrosPipe) _id: string) {
 
         const categoria: Categoria = await this.clientAdminBackend.send(TOPICS.CONSULTAR_CATEGORIAS, 
         atualizarJogadorDto.categoria).toPromise()
 
         if (categoria) {
         await this.clientAdminBackend.emit(TOPICS.ATUALIZAR_JOGADOR, { id: _id, jogador: atualizarJogadorDto } )

    } else {
     throw new BadRequestException(`Categoria não cadastrada!`)
    }
   }

   @Delete('/:_id')
   async deletarJogador(
       @Param('_id', ValidacaoParametrosPipe) _id: string) {
          await this.clientAdminBackend.emit(TOPICS.DELETAR_JOGADOR, { _id })
       } 






}