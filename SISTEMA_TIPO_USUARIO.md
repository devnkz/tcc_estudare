# Sistema de Atualização de Tipo de Usuário

## 📊 Tipos de Usuário no Banco (Atual)

Atualmente existem **3 tipos** de usuário no banco de dados:

1. **Admin** (ID: `231da7ba-89dd-4ef1-9608-219c1372d357`) - 2 usuários
2. **Professor** (ID: `941dd9b7-3012-4c5c-b35a-982a6e5a284e`) - 7 usuários  
3. **Aluno** (ID: `dcf9817e-9d57-4f68-9b29-eb5ca87ee26c`) - 2 usuários

## 🔧 Como Funciona a Atualização

### Backend

**Arquivo:** `Backend_tcc/src/controllers/users/updateUserController.ts`

#### Regras de Permissão:
- ✅ **Admin pode:** Alterar tipo de usuário de qualquer pessoa
- ❌ **Usuários comuns NÃO podem:** Alterar tipo de usuário (nem o próprio, nem de outros)
- ✅ **Qualquer usuário pode:** Alterar seus próprios dados básicos (nome, apelido, email, senha, foto)

#### Validação:
```typescript
function canChangeTipoUsuario(requestingRole?: string) {
    const r = requestingRole?.toLowerCase();
    return r === "adm" || r === "admin";
}
```

#### Endpoint:
- **Rota:** `PUT /users/:id`
- **Parâmetros:**
  - `nome_usuario`: string
  - `apelido_usuario`: string
  - `email_usuario`: string
  - `senha_usuario`: string
  - `foto_perfil`: string (opcional)
  - `fkIdTipoUsuario`: string (opcional, **apenas admin**)

#### Service:
**Arquivo:** `Backend_tcc/src/services/users/updateUserService.ts`

```typescript
interface UpdateUserProps {
    id: string;
    nome_usuario: string;
    apelido_usuario: string;
    email_usuario: string;
    senha_usuario: string;
    foto_perfil?: string;
    fkIdTipoUsuario?: string; // permitir troca do tipo de usuário
}
```

O service atualiza o usuário e retorna os dados com o `tipoUsuario` incluído.

### Frontend

**Arquivo:** `tcc_estudare/src/app/(Views)/(private)/dashboard/client.tsx`

#### Modal de Edição (linhas ~2350-2578):

O modal possui um `<select>` que mostra todos os tipos de usuário disponíveis:

```tsx
<select
  value={editUser.fkIdTipoUsuario}
  onChange={(e) => {
    setEditUser({
      ...editUser,
      fkIdTipoUsuario: e.target.value,
    });
  }}
>
  {tipousuario.map((t: any) => {
    const id = String(
      t.id_tipousuario ??
      t.id_tipoUsuario ??
      t.id_tipo_usuario ??
      t.id ??
      t.pkId_tipoUsuario
    );
    const nome =
      t.nome_tipousuario ??
      t.nomeTipoUsuario ??
      t.nome ??
      t.descricao ??
      "";
    return (
      <option key={id} value={id}>
        {String(nome)}
      </option>
    );
  })}
</select>
```

#### Service de Atualização:
**Arquivo:** `tcc_estudare/src/services/userService.ts`

Chama o endpoint do backend passando `fkIdTipoUsuario`.

## ✅ Correção Aplicada

### Problema Encontrado:
Na linha 429-439 do `dashboard/client.tsx`, havia tipos **hardcoded** que não existiam no banco:

```typescript
// ❌ ANTES (INCORRETO)
const base = new Set([
  "aluno",      // hardcoded
  "professor",  // hardcoded
  "adm",        // hardcoded (não existe no banco)
  ...nomes.filter(Boolean),
]);
```

### Solução:
```typescript
// ✅ DEPOIS (CORRETO)
const tipoUsuariosDisponiveis = useMemo(() => {
  const nomes = tipousuario.map((t: any) =>
    (t.nome_tipousuario ?? t.nomeTipoUsuario ?? t.nome ?? t.descricao ?? "")
      .toString()
      .toLowerCase()
  );
  return Array.from(new Set(nomes.filter(Boolean)));
}, [tipousuario]);
```

Agora o filtro de busca mostra **apenas os tipos que realmente existem no banco**:
- admin
- professor
- aluno

## 🎯 Como Usar no Dashboard

1. **Abrir modal de edição:** Clique no botão "Editar" ao lado de um usuário
2. **Alterar tipo:** No dropdown "Tipo de Usuário", selecione o tipo desejado
3. **Salvar:** Clique em "Salvar alterações"

**Nota:** Somente usuários do tipo **Admin** conseguem alterar o tipo de usuário.

## 📝 Schema do Banco

```prisma
model Usuarios {
  id_usuario            String  @id @default(uuid())
  nome_usuario          String
  apelido_usuario       String
  foto_perfil           String?
  email_usuario         String  @unique
  senha_usuario         String
  credibilidade_usuario Int

  fkIdTipoUsuario String
  tipoUsuario     TipoUsuario @relation(fields: [fkIdTipoUsuario], references: [id_tipousuario])
  
  // ... outros campos
}

model TipoUsuario {
  id_tipousuario   String     @id @default(uuid())
  nome_tipousuario String
  users            Usuarios[]
}
```

## 🔍 Como Verificar Tipos no Banco

Execute o script criado:

```bash
cd Backend_tcc
npx tsx checkTipos.ts
```

Resultado:
```
=== TIPOS DE USUÁRIO NO BANCO ===
- Admin (ID: 231da7ba-89dd-4ef1-9608-219c1372d357) - 2 usuários
- Professor (ID: 941dd9b7-3012-4c5c-b35a-982a6e5a284e) - 7 usuários
- Aluno (ID: dcf9817e-9d57-4f68-9b29-eb5ca87ee26c) - 2 usuários
=================================
```
