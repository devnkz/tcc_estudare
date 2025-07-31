import { useRouter } from "next/navigation";

interface PropsButton {
  textButton: string;
  rotaRedirecionamento: string;
}

export function Button({ textButton, rotaRedirecionamento }: PropsButton) {
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
