import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default function RootLayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} w-full flex flex-col items-center`}>
      {children}
    </div>
  );
}
