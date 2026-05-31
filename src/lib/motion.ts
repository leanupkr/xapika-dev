/**
 * Shared framer-motion tokens.
 *
 * Before this module the cubic-bezier `[0.16, 1, 0.3, 1]` ("soft ease-out") was
 * re-declared as a per-file `const EASE` in 9 components and inlined as a literal
 * in ~50 more call sites. Import `EASE` from here instead.
 *
 * Typed as a mutable 4-tuple to match framer-motion's bezier `Easing` shape so it
 * is directly assignable to a `transition.ease` prop.
 */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
