import { ArrowDownIcon } from "@heroicons/react/16/solid";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { FaRegLightbulb } from "react-icons/fa";
import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Image from "next/image";

export function SuaPerguntaPage() {

    const [isOpen, setIsOpen] = useState<any>();
    const [selectedSubject, setSelectedSubject] = useState<any>();

     const subjects = [
    "Português",
    "Matemática",
    "Física",
    "Química",
    "História",
    "Geografia",
    "Biologia",
    "Educação Física"
  ];

    return (
        <div id="suaPerguntaPage" className="h-screen w-full my-12 flex flex-col items-center space-y-8">
            <div className="space-y-4 w-4/5">
                <h1 className="text-black text-center font-bold text-4xl">Faça sua pergunta !</h1>
                <p className="text-gray-600 text-center">
                    Tem alguma dúvida? Não hesite em perguntar! Aproveite este espaço para esclarecer seus questionamentos e avançar nos seus estudos.
                </p>
            </div>

            <div className="w-4/5 flex justify-center items-center">

                <div className="w-full flex flex-col gap-4">
                    <div className="w-full border-b-2 h-fit p-2 flex items-center  gap-4 ">
                        <FaRegLightbulb className="text-xl"/>
                        <input placeholder="Faça sua pergunta..." className="w-full outline-none"/>
                    </div>

                    <div className="w-full space-y-4">
                        <h2 className="bg-zinc-200 p-4 rounded-lg text-zinc-600">Selecione o componente referente á sua pergunta</h2>
                        <div className="flex space-x-4">
                           
      <div className="relative w-64">
      <button
        className="bg-purple-600 p-4 cursor-pointer text-white rounded-lg flex justify-between items-center w-full hover:bg-purple-800 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2>{!selectedSubject ? "Base comum" : selectedSubject}</h2>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 w-full grid grid-cols-2 gap-2 bg-white p-4 rounded-b-lg shadow-lg">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`p-2 rounded-es-2xl rounded-se-2xl text-black ${
                selectedSubject === subject ? "bg-purple-700 text-white" : "bg-zinc-200"
              } hover:bg-purple-500 hover:text-white transition duration-300 cursor-pointer`}
              onClick={() => {
                setSelectedSubject(subject);
                setIsOpen(false);
              }}
            >
              {subject}
            </button>
          ))}
        </div>
      )}
    </div>

      
                            <button className="bg-purple-600 p-2 rounded-lg text-white cursor-pointer
                            hover:bg-purple-800 transition-all duration-300">Base técnica</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-4/5 rounded-lg border-1 border-zinc-700">
            <header className="flex w-full justify-between bg-zinc-300 p-4 rounded-t-lg">
                <h1 className="font-bold">Perguntas já feitas que podem te responder</h1>
                <ArrowDownIcon className="h-6 w-6"/>
            </header>
                <div className="p-4 h-[200px] flex justify-center items-center">
                    <p>Escreva sua pergunta e sugeriremos perguntas semelhantes que já foram respondidas!</p>
                </div>
            </div>
        </div>
    )
}