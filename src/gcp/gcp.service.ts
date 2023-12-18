import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GcpService {

    constructor(){

    }

    private logger = new Logger(GcpService.name)

    public async uploadArquivo(file:any, id: string){
        const GcpCloud ="coisas do gcp"

        const fileExtension =  file.originalname.split('.')[1]
        const urlKey = {url:`https://fakegcp:${id},${fileExtension}`}

        

        return urlKey
    }
    
}
