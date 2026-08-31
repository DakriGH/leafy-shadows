// LA GPU DA TELEFONO SI RICONOSCE DAL NOME — e l'elenco va provato sui nomi
// VERI che ANGLE riporta, perché è il tipo di lista che si sbaglia in silenzio:
// un falso negativo rimette il profilo desktop su un telefono travestito
// (6 fps, successo davvero), un falso positivo declassa un PC.

import test from 'node:test';
import assert from 'node:assert/strict';
import { gpuDaTelefono } from '../src/motore/qualita.js';

test('le GPU dei telefoni si riconoscono, nei nomi come li scrive ANGLE', () => {
  const daTelefono = [
    'ANGLE (ARM, Mali-G68, OpenGL ES 3.2)',                    // il rapporto vero del committente
    'ANGLE (Qualcomm, Adreno (TM) 619, OpenGL ES 3.2)',
    'ANGLE (Samsung Xclipse 920) on Vulkan',
    'Apple GPU',                                               // Safari su iPhone
    'PowerVR Rogue GE8320',
    'ANGLE (ARM, Immortalis-G715, OpenGL ES 3.2)',
  ];
  for (const nome of daTelefono) assert.ok(gpuDaTelefono(nome), nome);
});

test('le GPU da scrivania NON scattano — declassare un PC è l\'altro modo di sbagliare', () => {
  const daScrivania = [
    'ANGLE (NVIDIA Corporation, NVIDIA GeForce RTX 4060 Laptop GPU/PCIe/SSE2, OpenGL ES 3.2)',
    'ANGLE (AMD, AMD Radeon RX 6700 XT, D3D11)',
    'ANGLE (Intel, Intel(R) UHD Graphics 630, D3D11)',
    'Mesa Intel(R) HD Graphics 400 (BSW)',                     // il Chromebook: debole ma NON di classe telefono
    'llvmpipe (LLVM 15.0.6, 256 bits)',                        // il software: lo dice già `software`
  ];
  for (const nome of daScrivania) assert.ok(!gpuDaTelefono(nome), nome);
  assert.ok(!gpuDaTelefono(''), 'il nome vuoto non scatta');
  assert.ok(!gpuDaTelefono(null), 'null non scatta');
});
