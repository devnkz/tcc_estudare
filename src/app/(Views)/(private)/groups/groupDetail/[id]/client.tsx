import { Grupo } from "@/types/grupo";

interface ClientGrupoDetailProps {
  grupoAtual: Grupo;
}

export default function ClientGrupoDetail({
  grupoAtual,
}: ClientGrupoDetailProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{grupoAtual.nomeGrupo}</h1>

      <h2 className="mt-4 mb-2 font-semibold">Membros:</h2>
      <div className="flex gap-4 overflow-x-auto">
        {grupoAtual.membros?.map((membro) => (
          <div key={membro.id} className="flex flex-col items-center">
            <img
              src={membro.user.fotoPerfil ?? "/imagens/default-avatar.png"}
              alt={membro.user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="text-sm mt-1">{membro.user.apelido}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
