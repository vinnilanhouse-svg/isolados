// Retratos individuais gerados a partir da arte de referência do autor.
export const characters = [
  { name: 'Vinicius', codename: 'Elemental Z' },
  { name: 'Miguel', codename: 'Draconis' },
  { name: 'Fernanda', codename: 'Enchanted Tech' },
  { name: 'Amanda', codename: 'Kamikaze' },
  { name: 'Jennyfer', codename: 'Psych Girl' },
  { name: 'Allan', codename: 'Shadow Knight' },
  { name: 'Gabriel', codename: 'Lâmina Verde' },
  { name: 'Henrique', codename: 'Nuker' },
  { name: 'Jorge', codename: 'Warpad' }
].map(character => ({
  ...character,
  image: `/images/characters/${character.name.toLowerCase()}.png`,
  description: 'Descrição a inserir pelo autor.'
}));
