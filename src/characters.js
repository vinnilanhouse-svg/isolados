import { characterArtwork } from './character-art.js';

// Janelas de retrato sobre a composição original de referência (1536 × 1024).
// A imagem permanece intacta; cada ficha exibe seu próprio recorte.
export const characters = [
  { name: 'Vinicius', codename: 'Elemental Z', crop: { x: 496, y: 126, width: 256, height: 320 } },
  { name: 'Miguel', codename: 'Draconis', crop: { x: 810, y: 92, width: 220, height: 275 } },
  { name: 'Fernanda', codename: 'Enchanted Tech', crop: { x: 76, y: 437, width: 240, height: 300 } },
  { name: 'Amanda', codename: 'Kamikaze', crop: { x: 268, y: 420, width: 224, height: 280 } },
  { name: 'Jennyfer', codename: 'Psych Girl', crop: { x: 468, y: 430, width: 256, height: 320 } },
  { name: 'Allan', codename: 'Shadow Knight', crop: { x: 690, y: 488, width: 264, height: 330 } },
  { name: 'Gabriel', codename: 'Lâmina Verde', crop: { x: 884, y: 350, width: 232, height: 290 } },
  { name: 'Henrique', codename: 'Nuker', crop: { x: 1084, y: 326, width: 240, height: 300 } },
  { name: 'Jorge', codename: 'Warpad', crop: { x: 1280, y: 400, width: 256, height: 320 } }
].map(character => ({ ...character, image: characterArtwork, description: 'Descrição a inserir pelo autor.' }));
