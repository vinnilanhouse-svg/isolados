// Capas aprovadas pelo autor. Os textos originais ficam em src/chapters/.
export const chapterCovers = Object.fromEntries([
  'Vinicius algemado diante de um bunker nas montanhas ao amanhecer.',
  'Vinicius diante da entrada do Colégio Super.',
  'Vinicius e Miguel transformado em uma criatura dracônica enfrentam um enorme Yeti na neve.',
  'Vinicius aquece a comida ao lado de Amanda, enquanto Henrique e Jennyfer observam surpresos.',
  'Vinicius recebe apoio em um corredor, com um laboratório em chamas ao fundo.',
  'Fernanda diante de um robô, acompanhada por Vinicius.',
  'Vinicius e Fernanda descem uma escadaria, deixando dois rivais para trás.',
  'Vinicius movimenta o ar ao lado de Miguel, determinado e com as asas abertas, enquanto os amigos observam surpresos.',
  'Vinicius e Miguel conversam sentados em um vagão de metrô.'
].map((alt, index) => [index + 1, {
  src: `/images/chapters/capitulo-${String(index + 1).padStart(2, '0')}.webp`,
  alt,
  width: 1536,
  height: 1024
}]));
