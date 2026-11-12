"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(pointer: fine)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

export default function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}
