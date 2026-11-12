type LenisPauseListener = (paused: boolean) => void;

const listeners = new Set<LenisPauseListener>();

export function setLenisPaused(paused: boolean) {
  listeners.forEach((listener) => listener(paused));
}

export function subscribeLenisPause(listener: LenisPauseListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
