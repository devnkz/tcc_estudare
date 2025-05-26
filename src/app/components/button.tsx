import { useRouter } from "next/navigation"

interface PropsButton {
    icon?: React.ElementType;
    textButton: string,
    rotaRedirecionamento: string
}

export function Button({icon: Icon, textButton, rotaRedirecionamento }: PropsButton) {

    const router = useRouter();

    return (
        <button onClick={() => router.push(rotaRedirecionamento)} className="bg-purple-600 lg:bg-zinc-200 lg:hover:bg-purple-600 transition-all duration-500 cursor-pointer p-3 rounded-full group">
            {Icon && <Icon className="h-5 w-5" />}
            <p className="text-white lg:text-black group-hover:text-white transition-all duration-300">{textButton}</p>
        </button>
    )
}