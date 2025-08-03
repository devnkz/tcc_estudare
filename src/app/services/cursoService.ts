// src/services/cursoService.ts

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  imagem?: string;
  fkIdUsuarioCriador: string;
  fkIdMateria?: string;
  nivel?: string; // ex: 'iniciante', 'intermediário', 'avançado'
  duracao?: number; // em minutos
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCursoData {
  titulo: string;
  descricao: string;
  imagem?: string;
  fkIdUsuarioCriador: string;
  fkIdMateria?: string;
  nivel?: string;
  duracao?: number;
}

export interface UpdateCursoData {
  id: string;
  titulo?: string;
  descricao?: string;
  imagem?: string;
  fkIdMateria?: string;
  nivel?: string;
  duracao?: number;
}

// Busca todos os cursos
export async function fetchCursos(): Promise<Curso[]> {
  const res = await fetch("/api/curso");
  if (!res.ok) {
    throw new Error("Erro ao buscar cursos");
  }
  return res.json();
}

// Busca um curso pelo id
export async function fetchCursoById(id: string): Promise<Curso> {
  const res = await fetch(`/api/curso/${id}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar curso");
  }
  return res.json();
}

// Busca cursos por usuário criador
export async function fetchCursosByUsuario(usuarioId: string): Promise<Curso[]> {
  const res = await fetch(`/api/curso/usuario/${usuarioId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar cursos do usuário");
  }
  return res.json();
}

// Busca cursos por matéria
export async function fetchCursosByMateria(materiaId: string): Promise<Curso[]> {
  const res = await fetch(`/api/curso/materia/${materiaId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar cursos da matéria");
  }
  return res.json();
}

// Cria um novo curso
export async function createCurso(data: CreateCursoData): Promise<Curso> {
  const res = await fetch("/api/curso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar curso");
  }
  return res.json();
}

// Atualiza um curso existente
export async function updateCurso(data: UpdateCursoData): Promise<Curso> {
  const res = await fetch(`/api/curso/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar curso");
  }
  return res.json();
}

// Deleta um curso pelo id
export async function deleteCurso(id: string): Promise<void> {
  const res = await fetch(`/api/curso/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar curso");
  }
}

// Inscreve um usuário em um curso
export async function inscreveUsuarioCurso(cursoId: string, usuarioId: string): Promise<void> {
  const res = await fetch(`/api/curso/${cursoId}/inscricao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId }),
  });
  if (!res.ok) {
    throw new Error("Erro ao inscrever usuário no curso");
  }
}

// Cancela inscrição de um usuário em um curso
export async function cancelaInscricaoCurso(cursoId: string, usuarioId: string): Promise<void> {
  const res = await fetch(`/api/curso/${cursoId}/inscricao`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId }),
  });
  if (!res.ok) {
    throw new Error("Erro ao cancelar inscrição no curso");
  }
}

// Busca cursos em que um usuário está inscrito
export async function fetchCursosInscritos(usuarioId: string): Promise<Curso[]> {
  const res = await fetch(`/api/curso/inscricao/${usuarioId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar cursos inscritos");
  }
  return res.json();
}