import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { FC, useState } from "react";

interface InputComIconProps {
    icon: FC<{ className?: string }>;
    label: string;
    placeholder?: string;
    type?: string;
    podeMostrarSenha?: boolean;
}

export function InputComIcon({
    icon: Icon,
    label,
    placeholder,
    type = "text",
    podeMostrarSenha = false,
}: InputComIconProps) {

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const tipoInput = podeMostrarSenha
        ? mostrarSenha
            ? "text"
            : "password"
        : type;

    return (
        <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">{label}</span>
            <div className="flex gap-2 items-center bg-zinc-200 rounded px-3 py-2">
                <Icon className="text-zinc-400 h-6 w-6" />
                <input
                    type={tipoInput}
                    className="focus:outline-none bg-transparent flex-1"
                    placeholder={placeholder}
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

interface InputSemIconProps {
    label: string;
    placeholder?: string;
    type?: string;
}

export function InputSemIcon({
    label,
    placeholder,
    type = "text",
}: InputSemIconProps) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">{label}</span>
            <input
                type={type}
                className="bg-zinc-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder={placeholder}
                required
            />
        </label>
    );
}
