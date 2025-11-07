import Footer from "@/components/layout/footer";
import React from "react";

const notifications = new Array(6).fill(0).map((_, i) => ({
  id: i + 1,
  group: "Desenvolvimento Front-end",
  message: "tem novas mensagens",
  avatar: "/imagens/avatar-exemp.jpg",
  time: `${2 + i}h`,
}));

function BellIcon({ className = "w-6 h-6" }: { className?: string }) {
  // Heroicons outline bell (inline SVG to avoid extra deps)
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

function NotificationItem({ n }: { n: (typeof notifications)[0] }) {
  return (
    <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="w-14 h-14 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--primary-foreground)"
          style={{ color: "var(--primary-foreground)" }}
          className="w-7 h-7"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4.5 20.25a8.25 8.25 0 0115 0"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-[var(--foreground)] truncate">
            Grupo: {n.group}
          </h3>
          <span className="text-sm text-[var(--muted-foreground)]">
            {n.time}
          </span>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{n.message}</p>
        <div className="mt-2 flex items-center gap-2">
          <button className="text-sm text-[var(--muted-foreground)] hover:underline">
            Abrir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificacaoPage() {
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
          {notifications.map((n) => (
            <NotificationItem key={n.id} n={n} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
