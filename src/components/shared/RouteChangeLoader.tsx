"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteChangeLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // ajusta o tempo conforme a necessidade

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-70 flex items-center justify-center pointer-events-none">
      <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
