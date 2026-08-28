// FBX → glb, UNA VOLTA SOLA E FUORI DAL GIOCO.
//
// ⚠ BABYLON NON LEGGE L'FBX, e non è una mancanza: l'FBX è un formato di
// scambio proprietario, pensato per gli editor. glTF è il formato del web —
// si carica in una frazione del tempo perché è già nella forma che serve alla
// GPU, e pesa molto meno (l'albero: 53 KB contro il suo pezzo dei 3,4 MB).
//
// In Leafy-Lantern i modelli si caricavano in FBX A RUNTIME, con FBXLoader, e
// si pagava la conversione a ogni avvio, su ogni dispositivo. Qui si paga una
// volta qui, e il gioco riceve roba pronta.
//
// I modelli sorgente restano dove sono, in Leafy-Lantern: sono gli originali e
// non si toccano. Questo script legge di là e scrive qui.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, chmodSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
const SORGENTI = join(radice, '..', 'Lantern', 'Prefabs', 'OriginalMesh');
const DESTINAZIONE = join(radice, 'modelli');
const ATTREZZO = join(radice, 'node_modules', 'fbx2gltf', 'bin', 'Linux', 'FBX2glTF');

// ⚠ I NOMI SI TRADUCONO QUI, non nel gioco. Gli originali hanno i nomi
// dell'autore («Lampost», «Allll»); dentro Leafy tutto è in italiano, e il
// posto giusto per il ponte fra le due lingue è il confine, non il codice.
const MODELLI = {
  'Tree.fbx': 'albero',
  'Bench.fbx': 'panchina',
  'Lampost.fbx': 'lampione',
  'GrassCell.fbx': 'ciuffo',
  'watercubo.fbx': 'cubo-acqua',
  'Level.fbx': 'livello',
  'Level1.fbx': 'livello1',
  'Level2.fbx': 'livello2',
  'Allll.fbx': 'tutto',
};

if (!existsSync(ATTREZZO)) throw new Error('manca fbx2gltf: npm i -D fbx2gltf');
chmodSync(ATTREZZO, 0o755);
mkdirSync(DESTINAZIONE, { recursive: true });

let totale = 0;
for (const [fbx, nome] of Object.entries(MODELLI)) {
  const dentro = join(SORGENTI, fbx);
  if (!existsSync(dentro)) { console.log(`  ⚠ manca ${fbx}`); continue; }
  execFileSync(ATTREZZO, ['-i', dentro, '-o', join(DESTINAZIONE, nome), '--binary'], { stdio: 'pipe' });
  const peso = statSync(join(DESTINAZIONE, `${nome}.glb`)).size;
  totale += peso;
  console.log(`  ${fbx.padEnd(16)} → ${nome}.glb  ${(peso / 1024).toFixed(0)} KB`);
}
console.log(`\n✅ ${Object.keys(MODELLI).length} modelli, ${(totale / 1024).toFixed(0)} KB in tutto.`);
