import { useRouter } from "next/navigation"

export function Button({ textButton, rotaRedirecionamento }: { textButton: string, rotaRedirecionamento: string }) {

    const router = useRouter();

    return (
        <button onClick={() => router.push(rotaRedirecionamento)} className="bg-purple-600 lg:bg-zinc-200 lg:hover:bg-purple-600 transition-all duration-500 cursor-pointer p-3 rounded-full group">
            <p className="text-white lg:text-black group-hover:text-white transition-all duration-300">{textButton}</p>
        </button>
    )
}