export interface Denuncia {
    id_denuncia:string
    status:string
    resultado:string
    revisadoTipo?: string
    item_denunciado?: string
    fkId_conteudo_denunciado:string
    fkId_usuario_conteudo:string
    dataCriacao_denuncia: Date
    nivel_denuncia: number
    descricao: string
    tipo_conteudo: string
    usuario: {
        id_usuario: string
        nome_usuario: string
        apelido_usuario?: string
        credibilidade_usuario: number
    }
}

export interface CreateDenunciaData {
    fkId_usuario:string
    fkId_conteudo_denunciado:string
    fkId_usuario_conteudo:string
    descricao: string
    nivel_denuncia:number  
    tipo_denuncia?: string
    resultado: string
    tipo_conteudo: string
}