// DENTRO IL GLSL INNESTATO I COMMENTI NON SONO INERTI.
//
// Tre difetti diversi nella stessa giornata, tutti nati in una riga di commento
// dentro un innesto di CustomMaterial, e tutti e tre MUTI — il materiale non
// diventava pronto e la mesh spariva, con centomila istanze corrette e la
// console vuota:
//
//  1. un BACKTICK chiude il template JS (nove volte fra i due progetti);
//  2. un'ESPRESSIONE ANDATA A CAPO si rompe, perché il processore di shader di
//     Babylon lavora riga per riga («0:320: '?' : syntax error» su un ternario);
//  3. una DIRETTIVA DI INCLUSIONE scritta per esteso viene ESEGUITA: il
//     preprocessore la cerca con una regex su tutto il testo, commenti
//     compresi. Il mio commento citava per nome l'inclusione delle istanze e me
//     l'ha espansa dentro la variante NON istanziata, dove world0..world3 non
//     esistono. Tre ore.
//
// Qui si presidiano il 2 e il 3; il backtick sta in glsl-backtick.test.mjs.
//
// Il processore di shader di Babylon lavora RIGA PER RIGA. Un'espressione
// spezzata su più righe dentro un innesto di CustomMaterial gli sfugge, e il
// GLSL che ne esce è malformato: il primo caso è stato un ternario andato a capo
// che dava «VERTEX SHADER ERROR: 0:320: '?' : syntax error».
//
// ⚠ E IL DIFETTO ERA MUTO DUE VOLTE. Il materiale non diventava mai pronto e la
// mesh semplicemente non si disegnava — 101.698 istanze corrette, dati corretti,
// niente a schermo e niente in console. Peggio: `forceCompilation` rispondeva
// «compilato ok». L'errore vero sta in `subMesh.effect.getCompilationError()`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const MOTORE = fileURLToPath(new URL('../src/motore/', import.meta.url));

/**
 * TUTTI I BLOCCHI DI GLSL DI UN FILE, e sono di DUE forme.
 *
 * ⚠ E LE PROVE NE GUARDAVANO UNA SOLA — è il motivo per cui il difetto di
 * «#define E 2.71828» è passato. Cercavano solo gli innesti scritti sul posto,
 * «Fragment_Before_FragColor(`…`)», mentre il GLSL più delicato del progetto
 * (l'accumulo delle luci, il cammino nella griglia) vive in COSTANTI esportate
 * — perché sta accanto ai dati che descrive. Un presidio con un buco della
 * forma esatta del codice più rischioso.
 */
function blocchiGlsl(testo) {
  const fuori = [];
  for (const m of testo.matchAll(/(?:Vertex|Fragment)_[A-Za-z_]+\(\s*(?:m,\s*)?`([\s\S]*?)`/g)) fuori.push(m[1]);
  for (const m of testo.matchAll(/\bGLSL_[A-Z_]+\s*=\s*`([\s\S]*?)`;/g)) fuori.push(m[1]);
  return fuori;
}

test('nessuna direttiva di inclusione dentro il GLSL innestato', () => {
  const colpevoli = [];
  for (const n of readdirSync(MOTORE)) {
    if (!n.endsWith('.js')) continue;
    const s = readFileSync(join(MOTORE, n), 'utf8');
    for (const b of blocchiGlsl(s)) {
      // la forma che il preprocessore cerca: cancelletto, include, angolari
      const m = b.match(/#\s*include\s*</g);
      if (m) colpevoli.push(`${n}: ${m.length} inclusioni`);
    }
  }
  assert.deepEqual(colpevoli, [],
    'una direttiva di inclusione dentro un innesto viene ESEGUITA, anche in un commento:\n  ' + colpevoli.join('\n  '));
});

test('nessuna riga di GLSL innestato finisce a metà espressione', () => {
  const colpevoli = [];
  for (const n of readdirSync(MOTORE)) {
    if (!n.endsWith('.js')) continue;
    const s = readFileSync(join(MOTORE, n), 'utf8');
    for (const b of blocchiGlsl(s)) {
      for (const riga of b.split('\n')) {
        const r = riga.trim();
        if (!r || r.startsWith('//')) continue;
        // una riga di codice finisce con ; { } o è una direttiva: se finisce
        // con un operatore, l'espressione continua a capo ed è il difetto
        if (/[?:+\-*/,&|=<>]$/.test(r) && !r.endsWith('--') && !r.endsWith('++')) {
          colpevoli.push(`${n}: ${r}`);
        }
      }
    }
  }
  assert.deepEqual(colpevoli, [],
    'espressioni GLSL spezzate a capo (il processore di Babylon legge riga per riga):\n  ' + colpevoli.join('\n  '));
});

// ⚠ E NIENTE NOMI DI UNA LETTERA DENTRO IL GLSL INNESTATO.
//
// Il nostro codice vive in mezzo a duemila righe di Babylon piene di macro, e
// il preprocessore non conosce ambiti: sostituisce il testo, ovunque sia. Il
// blocco della NEBBIA emette «#define E 2.71828», e una mia variabile locale
// chiamata «E» è diventata «vec3 2.71828 = uLuciEst[i].xyz;» — schermo vuoto e
// un errore di sintassi su un numero che non avevo mai scritto.
//
// ⚠ SOLO LE MAIUSCOLE, e la distinzione non è pignoleria: le macro, per
// convenzione universale in C e in GLSL, sono maiuscole — Babylon rispetta la
// convenzione, e infatti le sue sono E, PI, TWO_PI, HALF_PI. Un contatore di
// ciclo minuscolo («int i») è idiomatico e non collide con niente: vietarlo
// renderebbe la prova fastidiosa, e una prova fastidiosa si disattiva.
test('nessuna variabile di una lettera nel GLSL innestato', () => {
  const colpevoli = [];
  const tipi = 'float|int|bool|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4';
  for (const n of readdirSync(MOTORE)) {
    if (!n.endsWith('.js')) continue;
    const s = readFileSync(join(MOTORE, n), 'utf8');
    for (const b of blocchiGlsl(s)) {
      for (const m of b.matchAll(new RegExp(`\\b(?:${tipi})\\s+([A-Z])\\s*[=;]`, 'g'))) {
        colpevoli.push(`${n}: ${m[1]}`);
      }
    }
  }
  assert.deepEqual(colpevoli, [],
    'una lettera sola può collidere con una macro di Babylon (E vale 2.71828)');
});
