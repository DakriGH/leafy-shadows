/**
 * LE PALLE DI PROVA — sfere solide che galleggiano nel banco dell'acqua.
 *
 * Sono i segnaposto degli NPC e dei modelli che un giorno staranno in acqua:
 * servono a guardare tuffo, scia e schiuma di contatto su corpi VERI, di
 * misure diverse, non su un punto matematico.
 *
 * ⚠ IL NOME È METÀ DEL LAVORO: `palla:N` non compare in `FUORI_DALLE_PASSATE`
 * (acqua.js), quindi le sfere entrano DA SOLE nello specchio, nella rifrazione
 * e nella mappa di profondità — riflesso e schiuma al bordo arrivano gratis,
 * senza una riga qui. Chi le rinominasse `acqua-palla` le farebbe sparire da
 * tutte e tre le passate in silenzio.
 *
 * La fisica NON sta qui (regola della casa: qui solo il motore): sta in
 * `gioco/galleggiante.js`, provata in Node.
 */

import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder.js';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js';
import { Color3 } from '@babylonjs/core/Maths/math.color.js';

export function pallaSolida(rig, raggio, tintaHex, indice) {
  const mesh = CreateSphere(`palla:${indice}`, { diameter: raggio * 2, segments: 14 }, rig.scena);
  const mat = new StandardMaterial(`palla-mat:${indice}`, rig.scena);
  // ⚠ TINTA PIATTA VERA: emissiva, non diffusa. Col diffuse nudo la sfera
  // prende il suo N·L e esce sfumata «in modo semi realistico» — che è la
  // frase esatta con cui lo stile di casa è stato bocciato. La forma la
  // danno il moto, la schiuma al bordo e il riflesso, non la sfumatura.
  mat.emissiveColor = Color3.FromHexString(tintaHex);
  mat.diffuseColor = new Color3(0, 0, 0);
  mat.specularColor = new Color3(0, 0, 0);
  mesh.material = mat;
  mesh.isPickable = false; // la mira la facciamo noi in JS, raggio contro sfera
  return mesh;
}
