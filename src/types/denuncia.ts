export interface Denuncia {
    id_denuncia:String
    
    status:String
    resultado:String
    dataCriacao_denuncia: Date
}

export interface CreateDenunciaData {
    fkId_usuario:String
    fkId_conteudo_denunciado:String
    descricao: String
    nivel_denuncia:number  
    resultado: string
}