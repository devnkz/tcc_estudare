import Link from "next/link";

interface PropsButton {
  icon?: React.ElementType;
  textButton: string;
  rotaRedirecionamento: string;
}

export function Button({
  icon: Icon,
  textButton,
  rotaRedirecionamento,
}: PropsButton) {
  return (
    <Link href={rotaRedirecionamento}>
      <button type="submit" className="bg-purple-600 lg:bg-zinc-200 lg:hover:bg-purple-600 transition-all duration-500 cursor-pointer p-3 rounded-full group">
        {Icon && <Icon className="h-5 w-5" />}
        <p className="text-white lg:text-black group-hover:text-white transition-all duration-300">
          {textButton}
        </p>
      </button>
    </Link>
  );
}

import { useRouter } from "next/navigation";

interface PropsButton {
  textButton: string;
  rotaRedirecionamento: string;
}

export function ButtonAuth({ textButton, rotaRedirecionamento }: PropsButton) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(rotaRedirecionamento)}
      className="bg-purple-600 lg:bg-zinc-200 lg:hover:bg-purple-600 transition-all duration-500 cursor-pointer p-3 rounded-lg group"
    >
      <p className="text-white lg:text-black group-hover:text-white transition-all duration-300">
        {textButton}
      </p>
    </button>
  );
}

export function BotoesFormulario({ textButton }: { textButton: string }) {
  return (
    <button
      type="submit"
      className="bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition cursor-pointer"
    >
      {textButton}
    </button>
  );
}

interface MensagemRedirecionamentoProps {
  textButton: string;
  pergunta: string;
  rotaRedirecionamento: string;
}

export function MensagemRedirecionamento({
  textButton,
  pergunta,
  rotaRedirecionamento,
}: MensagemRedirecionamentoProps) {
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
  );
}
