// src/hooks/useHeaderOffset.ts
import { useEffect, useState } from "react";

export function useHeaderOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setOffset(header.offsetHeight);
    }
  }, []);

  return offset;
}
