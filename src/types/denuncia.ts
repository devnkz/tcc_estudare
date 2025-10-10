export interface Denuncia {
    id_denuncia:string
    status:string
    resultado:string
    dataCriacao_denuncia: Date
    nivel_denuncia: number
    descricao: string
    usuario: {
        nome_usuario: string
        credibilidade_usuario: number
    }
}

export interface CreateDenunciaData {
    fkId_usuario:string
    fkId_conteudo_denunciado:string
    descricao: string
    nivel_denuncia:number  
    resultado: string
    tipo_conteudo: string
}