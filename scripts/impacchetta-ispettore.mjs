// L'ISPETTORE SI IMPACCHETTA UNA VOLTA SOLA, e poi si dimentica.
//
// ⚠ PERCHÉ SERVE UN PASSAGGIO DI BUILD PROPRIO QUI, in un progetto zero-build.
// L'Inspector v2 di Babylon 9 è scritto in React, e React su npm è ancora
// **CommonJS**: `'use strict'; if (process.env.NODE_ENV …)`. Una import map non
// lo può caricare — il browser dice «Failed to resolve module specifier
// "react/jsx-runtime"» e finisce lì. Non è un difetto di Babylon né nostro: è
// che il pacchetto React non ha un ingresso ESM.
//
// La cura NON è mettere un bundler in mezzo al gioco. È impacchettare l'ATTREZZO
// una volta, tenerne il risultato in `vendor/`, e lasciare il gioco com'è: zero
// build, moduli ES, import map. Stesso trattamento che in Leafy-Lantern aveva
// MindAR — un file vendorizzato, rigenerabile con uno script, mai modificato a
// mano.
//
// ⚠ E `@babylonjs/core` RESTA FUORI dal pacchetto (external). Se ci finisse
// dentro, l'ispettore avrebbe una SUA copia del motore e guarderebbe una scena
// che non è la nostra: due Babylon nello stesso documento non si vedono.
import { build } from 'esbuild';

await build({
  entryPoints: ['node_modules/@babylonjs/inspector/lib/index.js'],
  bundle: true,
  format: 'esm',
  outfile: 'vendor/ispettore.js',
  external: ['@babylonjs/core/*', '@babylonjs/core'],
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  loader: { '.svg': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' },
  logLevel: 'info',
});
