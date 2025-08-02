import Footer from "@/components/layout/footer";
import { InicialPage } from "../pages/InicialPage";
import PerguntasIndex from "./Perguntas";

export default function HomePage() {
  return (
    <div className="bg-white w-full flex flex-col justify-between items-center">
      <div className="w-full lg:max-w-[1200px] flex p-4">
        <div className="w-full p-4 flex flex-col items-center gap-4">
          <InicialPage />
          <PerguntasIndex />
        </div>
      </div>
      <Footer />
    </div>
  );
}
