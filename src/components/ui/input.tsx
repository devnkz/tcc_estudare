import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { FC, useState } from "react";

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  icon?: FC<{ className?: string }>;
  podeMostrarSenha?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  placeholder,
  type = "text",
  icon: Icon,
  podeMostrarSenha = false,
  value,
  onChange,
}: InputProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const tipoInput = podeMostrarSenha
    ? mostrarSenha
      ? "text"
      : "password"
    : type;

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <div
        className={`flex items-center rounded px-3 py-2 ${
          Icon || podeMostrarSenha ? "gap-2 bg-zinc-200" : "bg-zinc-200"
        }`}
      >
        {Icon && <Icon className="text-zinc-400 h-6 w-6" />}
        <input
          type={tipoInput}
          className={`flex-1 bg-transparent focus:outline-none ${
            !Icon && !podeMostrarSenha ? "px-0" : ""
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
        {podeMostrarSenha && (
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="text-zinc-500 hover:text-zinc-700 transition cursor-pointer"
          >
            {mostrarSenha ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </label>
  );
}
