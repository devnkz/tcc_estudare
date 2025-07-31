import { useRouter } from "next/navigation";

export function BotoesFormulario({ textButton }: { textButton: string }) {
    return (
        <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition cursor-pointer"
        >
            {textButton}
        </button>
    )
}

interface MensagemRedirecionamentoProps {
    textButton: string;
    pergunta: string;
    rotaRedirecionamento: string;
}

export function MensagemRedirecionamento({ textButton, pergunta, rotaRedirecionamento }: MensagemRedirecionamentoProps) {

    const router = useRouter();

    return (
        <div className="text-center text-sm mt-2">
            {pergunta}{" "}
            <button
                onClick={() => router.push(rotaRedirecionamento)}
                type="button"
                className="text-purple-600 hover:underline cursor-pointer"
            >
                {textButton}
            </button>
        </div>
    )
}

