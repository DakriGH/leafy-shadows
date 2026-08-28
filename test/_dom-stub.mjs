// Stub minimo di DOM per i test in Node: alcuni moduli di gioco creano canvas
// al caricamento (materials.js). Va importato PER PRIMO — gli import ESM sono
// valutati in ordine, quindi uno stub messo nel corpo del test arriverebbe tardi.
const ctx2d = new Proxy({}, { get: () => () => {} });
globalThis.document = {
  createElement: () => ({ width: 0, height: 0, style: {}, getContext: () => ctx2d }),
};
