/** True while Lenis is animating to a hash target. Scramble must not arm mid-flight. */
let programmatic = false;

export function setProgrammaticScroll(value: boolean) {
  programmatic = value;
}

export function isProgrammaticScroll() {
  return programmatic;
}
