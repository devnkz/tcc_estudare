"use client";

import Footer from "../../../../components/layout/footer";

function BellIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082A3 3 0 0 1 12 19.5a3 3 0 0 1-2.857-2.418M12 3v1.5m6 6.75V11a6 6 0 10-12 0v.25m12 0a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 11.25"
      />
    </svg>
  );
}

function NotificationItem({ n }: { n: any }) {
  async function deleteNotification() {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notificacao/${n.id_notificacao}`,
      { method: "DELETE" }
    );
  }

  return (
    <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="w-14 h-14 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center flex-shrink-0">
        <svg /* ... ícone ... */ />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-[var(--foreground)] truncate">
            {n.titulo}
          </h3>
          <span className="text-sm text-[var(--muted-foreground)]">
            {new Date(n.dataCriacao_notificacao).toLocaleDateString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="text-sm text-[var(--muted-foreground)]">{n.mensagem}</p>

        <div className="mt-2 flex items-center gap-3">
          <button className="text-sm text-[var(--muted-foreground)] hover:underline">
            Abrir
          </button>

          {/* 🔥 Botão deletar */}
          <button
            onClick={deleteNotification}
            className="text-sm text-red-500 hover:underline"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificacaoPageClient({ data }: { data: any[] }) {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between items-center bg-[var(--background)]">
      <main className="w-full max-w-[1200px] px-4 md:px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-md p-2 bg-[var(--primary)] text-[var(--primary-foreground)]">
              <BellIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
                Notificações
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Aqui estão as suas últimas notificações
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 rounded-md bg-[var(--secondary)] text-[var(--secondary-foreground)] text-sm">
              Limpar
            </button>
            <button className="px-3 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm">
              Marcar todas
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.length === 0 ? (
            <p className="text-[var(--muted-foreground)] text-sm">
              Você não possui notificações no momento.
            </p>
          ) : (
            data.map((n: any) => (
              <NotificationItem key={n.id_notificacao} n={n} />
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
