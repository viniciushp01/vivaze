// Conteúdo dos 10 serviços. Cada item alimenta a home, a listagem e a página do serviço.
// Para editar um texto, altere aqui: as três telas mudam juntas.

type Pergunta = [pergunta: string, resposta: string];

export interface Servico {
  slug: string;
  nome: string;
  nomeLista: string; // nome usado nos cards da home e da listagem
  familia: 'CabinePhoto' | 'Experiência' | 'Totem' | 'Paparazzi';
  filtro: 'cabinephoto' | 'experiencias' | 'totens' | 'paparazzi';
  artigo: string; // "a Cabine Tradicional", "o Espelho Mágico"
  precisa: string; // "a cabine", "o totem"
  home: { foto: string; pos: string; frase: string };
  lista: { foto: string; pos: string; texto: string; chips?: string[] };
  hero: { foto: string; pos: string; linha: string };
  descricao: { titulo: string; texto: string; itens: string[] };
  galeria: { titulo: string; fotos: string[] };
  impacto: { frase: string; sub: string };
  faq: Pergunta[];
  veja: string[];
  seo: { title: string; description: string; h1: string };
}

const tempo = (sujeito: string): Pergunta => [
  `Quanto tempo ${sujeito} fica no evento?`,
  'Temos pacotes de 2, 3, 4, 5 ou mais horas. A duração é combinada de acordo com o seu evento.',
];
const P = {
  limite: ['Tem limite de fotos?', 'Não. As fotos são ilimitadas, por grupo ou por pessoa.'] as Pergunta,
  limiteFV: ['Tem limite de fotos ou vídeos?', 'Não. As fotos são ilimitadas, por grupo ou por pessoa, e os vídeos também.'] as Pergunta,
  limiteV: ['Tem limite de vídeos?', 'Não. Os vídeos são ilimitados.'] as Pergunta,
  formatos: ['Quais formatos de foto vocês fazem?', '10x15, 15x20, tirinha (5x15) e Polaroid, sempre com a moldura no tema da festa.'] as Pergunta,
  pers: ['As fotos saem personalizadas?', 'Sim. A moldura é criada com o tema da festa e o gosto do cliente, e a foto é impressa na hora.'] as Pergunta,
  receber: ['Como recebo as fotos depois?', 'No fim do evento a gente envia um link com todas as fotos, para rever e baixar.'] as Pergunta,
  receberFV: ['Como recebo as fotos e os vídeos?', 'No fim do evento a gente envia um link com todas as fotos. Os vídeos ficam na nuvem, com acesso por QR Code ou link.'] as Pergunta,
  receberV: ['Como os convidados recebem o vídeo?', 'Na hora, por QR Code. Depois do evento, os vídeos continuam disponíveis na nuvem, por QR Code ou link.'] as Pergunta,
  duram: ['As fotos perdem qualidade com o tempo?', 'Não. Usamos papel fotográfico com uma película que protege a imagem por muitos anos.'] as Pergunta,
  acess: ['Vocês levam acessórios?', 'Sim. Plaquinhas, óculos, chapéus, máscaras, tiaras e vários outros.'] as Pergunta,
  rapidez: ['A foto sai na hora?', 'Sim. A foto é impressa em cerca de 8 segundos, já com a moldura da festa.'] as Pergunta,
  pessoas360: ['Quantas pessoas sobem por vez?', 'Até 3 pessoas por vez.'] as Pergunta,
  ilha: ['As fotos são impressas no próprio evento?', 'Sim. A gente monta uma ilha de impressão no local e as fotos vão para o varal durante a festa.'] as Pergunta,
};

export const servicos: Servico[] = [
  {
    slug: 'cabine-tradicional', nome: 'Cabine Tradicional', nomeLista: 'Cabine Tradicional', familia: 'CabinePhoto', filtro: 'cabinephoto',
    artigo: 'a Cabine Tradicional', precisa: 'a cabine',
    home: { foto: 'L37', pos: 'center 40%', frase: 'Fotos impressas na hora, com cortinas na cor da sua festa' },
    lista: { foto: 'L41', pos: 'center 40%', texto: 'A nossa cabine de fotos mais pedida. Fotos impressas em poucos segundos, cortinas em várias cores para combinar com a decoração e um assistente cuidando de cada convidado.', chips: ['Fotos na hora', 'Cortinas personalizadas', 'Link para baixar'] },
    hero: { foto: 'hero', pos: 'center 18%', linha: 'Cabine de fotos com impressão na hora, cortinas na cor da festa e um assistente com os convidados.' },
    descricao: { titulo: 'Entrar, sorrir e sair com a foto na mão', texto: 'Seus convidados entram, escolhem os acessórios e saem com a foto impressa na mão em poucos segundos. As cortinas vêm em várias cores para combinar com a decoração, a foto leva a identidade do seu evento e, depois da festa, todo mundo recebe um link para rever e baixar tudo.', itens: ['Fotos impressas na hora', 'Foto com a identidade do evento', 'Assistente cuidando dos convidados', 'Link para baixar todas as fotos'] },
    galeria: { titulo: 'Momentos reais na Cabine Tradicional', fotos: ['L77', 'v12_25', 'L72', 'L36'] },
    impacto: { frase: 'Cada foto é alguém que se sentiu importante.', sub: 'Da primeira à última foto, um assistente cuida de cada convidado na cabine. Você só precisa viver o momento.' },
    faq: [tempo('a cabine'), P.rapidez, P.limite, P.formatos],
    veja: ['cabine-vip', 'totem-foto-lembranca', 'paparazzi-varal'],
    seo: { title: 'Aluguel de cabine de fotos em BH | Cabine Tradicional Vivaze', description: 'Aluguel de cabine de fotos em BH com impressão na hora, cortinas na cor da festa, assistente e link para baixar as fotos. Peça seu orçamento.', h1: 'cabine de fotos com impressão na hora' },
  },
  {
    slug: 'cabine-vip', nome: 'Cabine VIP', nomeLista: 'Cabine VIP', familia: 'CabinePhoto', filtro: 'cabinephoto',
    artigo: 'a Cabine VIP', precisa: 'a cabine',
    home: { foto: 'p-vip', pos: 'center', frase: 'Um ambiente elegante ao redor do momento' },
    lista: { foto: 'L57', pos: 'center 40%', texto: 'Estrutura em madeira, cortinas e TV de 32 polegadas: um ambiente mais elegante ao redor do momento, sem perder a espontaneidade de sempre. As fotos ficam disponíveis por QR Code durante a festa.', chips: ['Estrutura em madeira', 'QR Code na festa', 'TV de 32″'] },
    hero: { foto: 'L53', pos: 'center 25%', linha: 'Cabine de fotos em madeira, com cortinas e TV, para casamentos e eventos.' },
    descricao: { titulo: 'Madeira, cortinas e uma TV para quem espera a vez', texto: 'A Cabine VIP tem estrutura em madeira, cortinas e uma TV de 32 polegadas do lado de fora, para quem está esperando também acompanhar a diversão. As fotos são impressas na hora, levam a identidade do seu evento e ficam disponíveis por QR Code ainda durante a festa.', itens: ['Estrutura em madeira e cortinas', 'Fotos impressas na hora', 'QR Code para baixar na festa', 'TV externa de 32 polegadas'] },
    galeria: { titulo: 'Momentos reais na Cabine VIP', fotos: ['L55', 'L58', 'L54', 'v9_50'] },
    impacto: { frase: 'Elegância que não tira ninguém do momento.', sub: 'Quem espera a vez acompanha a diversão pela TV do lado de fora.' },
    faq: [tempo('a Cabine VIP'), P.pers, P.limite, P.duram],
    veja: ['cabine-tradicional', 'espelho-magico', 'lambe-lambe-retro'],
    seo: { title: 'Cabine de fotos VIP para casamentos e eventos em BH | Vivaze', description: 'Cabine de fotos VIP em madeira, com cortinas, TV de 32 polegadas e fotos por QR Code, para casamentos e eventos em BH. Peça seu orçamento.', h1: 'cabine de fotos em madeira para casamentos e eventos' },
  },
  {
    slug: 'espelho-magico', nome: 'Espelho Mágico', nomeLista: 'Espelho Mágico', familia: 'Experiência', filtro: 'experiencias',
    artigo: 'o Espelho Mágico', precisa: 'o espelho',
    home: { foto: 'L64', pos: 'center 40%', frase: 'Cada convidado, a estrela da noite' },
    lista: { foto: 'g-espelho-dourado', pos: 'center 50%', texto: 'Um espelho que faz cada convidado se sentir a estrela da noite, só de se olhar nele. Fotos profissionais impressas na hora, com tapete e personalização.' },
    hero: { foto: 'g-espelho-familia', pos: 'center 55%', linha: 'O convidado faz a pose no espelho e recebe a foto impressa na hora.' },
    descricao: { titulo: 'Um tapete, um espelho e a sua melhor pose', texto: 'O Espelho Mágico tem equipamento profissional de fotografia por trás do reflexo e um tapete para completar a cena. O convidado se olha, faz a pose e recebe a foto impressa na hora, personalizada com a identidade do seu evento. Depois, todo mundo revê e baixa as fotos pelo link.', itens: ['Equipamento profissional', 'Tapete para completar a cena', 'Fotos impressas na hora', 'Link para baixar as fotos'] },
    galeria: { titulo: 'Momentos reais no Espelho Mágico', fotos: ['p-espelho', 'v5_25', 'g-espelho-dourado', 'v6_25'] },
    impacto: { frase: 'Todo mundo merece um momento de estrela.', sub: 'E um assistente cuida para que nenhum convidado saia sem o seu.' },
    faq: [tempo('o Espelho Mágico'), P.pers, P.limite, P.receber],
    veja: ['cabine-vip', 'tunel-infinity', 'cabine-360'],
    seo: { title: 'Espelho Mágico para festas e eventos em BH | Vivaze', description: 'Espelho Mágico para festas e eventos em BH: o convidado faz a pose e recebe a foto impressa na hora, personalizada. Peça seu orçamento.', h1: 'fotos impressas na hora em frente ao espelho' },
  },
  {
    slug: 'tunel-infinity', nome: 'Túnel Infinity', nomeLista: 'Túnel Infinity', familia: 'Experiência', filtro: 'experiencias',
    artigo: 'o Túnel Infinity', precisa: 'o túnel',
    home: { foto: 'L139', pos: 'center 35%', frase: 'Foto e vídeo num túnel de luz' },
    lista: { foto: 'L140', pos: 'center 45%', texto: 'Um túnel de LED com mais de 360 efeitos de luz. Foto e vídeo na mesma experiência, com QR Code para baixar na hora.' },
    hero: { foto: 'p-tunel', pos: 'center 30%', linha: 'Túnel de LED com foto impressa e vídeo no mesmo lugar.' },
    descricao: { titulo: 'Foto e vídeo numa experiência só', texto: 'Um túnel preto com estrutura de LED e mais de 360 efeitos de luz transforma foto e vídeo numa experiência só. Os vídeos ganham música e personalização, as fotos saem impressas na hora e cada convidado baixa tudo por QR Code ainda durante o evento.', itens: ['Mais de 360 efeitos de luz', 'Foto impressa e vídeo', 'QR Code durante o evento', 'Acessórios divertidos'] },
    galeria: { titulo: 'Momentos reais no Túnel Infinity', fotos: ['L134', 'L136', 'L131', 'L129'] },
    impacto: { frase: 'Luz para quem veio brilhar.', sub: 'O convidado entra, escolhe foto ou vídeo e baixa tudo pelo QR Code ainda na festa.' },
    faq: [tempo('o túnel'), P.limiteFV, P.acess, P.receberFV],
    veja: ['cabine-360', 'espelho-magico', 'totem-2-em-1'],
    seo: { title: 'Túnel Infinity: túnel de LED com foto e vídeo em BH | Vivaze', description: 'Túnel de LED com mais de 360 efeitos de luz, foto impressa e vídeo com QR Code para festas e eventos em BH. Peça seu orçamento.', h1: 'túnel de LED com foto e vídeo' },
  },
  {
    slug: 'cabine-360', nome: 'Cabine 360°', nomeLista: 'Cabine 360°', familia: 'Experiência', filtro: 'experiencias',
    artigo: 'a Cabine 360°', precisa: 'a plataforma',
    home: { foto: 'p-360', pos: 'center 70%', frase: 'Vídeos em 360° com QR Code na hora' },
    lista: { foto: 'v1_50', pos: 'center 40%', texto: 'Plataforma 360: os convidados sobem, a câmera gira em volta e o vídeo fica pronto na hora. Com moldura, música e efeitos, compartilhado por QR Code.' },
    hero: { foto: 'p-360', pos: 'center 62%', linha: 'Plataforma 360 para festas e eventos, com vídeo pronto na hora.' },
    descricao: { titulo: 'Suba, gire e compartilhe na hora', texto: 'Na plataforma com piso de LED, os convidados giram cercados de luz enquanto um iPhone grava em alta resolução. O vídeo sai com moldura, música e efeitos como câmera lenta e boomerang, e é compartilhado na hora por QR Code. Cabem até 3 pessoas por vez.', itens: ['Vídeos em alta resolução', 'Câmera lenta e boomerang', 'QR Code para compartilhar', 'Letreiro com o nome do evento'] },
    galeria: { titulo: 'Momentos reais na Cabine 360°', fotos: ['v0_50', 'v3_50', 'v4_25', 'v2_25'] },
    impacto: { frase: 'A festa vista de todos os ângulos.', sub: 'O vídeo sai na hora, com música e moldura, pronto para compartilhar.' },
    faq: [tempo('a plataforma 360'), P.pessoas360, P.limiteV, P.receberV],
    veja: ['tunel-infinity', 'totem-2-em-1', 'espelho-magico'],
    seo: { title: 'Plataforma 360 para festas e eventos em BH | Vivaze', description: 'Aluguel de plataforma 360 em BH: vídeos com música, moldura, câmera lenta e boomerang, compartilhados na hora por QR Code. Peça seu orçamento.', h1: 'plataforma 360 com vídeo pronto na hora' },
  },
  {
    slug: 'lambe-lambe-retro', nome: 'Lambe-Lambe Retrô', nomeLista: 'Lambe-Lambe Retrô', familia: 'Experiência', filtro: 'experiencias',
    artigo: 'o Lambe-Lambe Retrô', precisa: 'o lambe-lambe',
    home: { foto: 'p-lambe', pos: 'center 40%', frase: 'Clima rústico e sofisticado' },
    lista: { foto: 'L81', pos: 'center 40%', texto: 'Uma homenagem aos antigos lambe-lambes, só que digital, rápida e moderna. Para quem busca um clima rústico e sofisticado ao mesmo tempo.' },
    hero: { foto: 'p-lambe', pos: 'center 35%', linha: 'Câmera de madeira no estilo lambe-lambe, com foto impressa na hora.' },
    descricao: { titulo: 'Uma câmera de madeira que imprime a foto na hora', texto: 'A câmera de madeira traz o clima dos antigos lambe-lambes, e a tecnologia faz o resto: fotos impressas na hora, acessórios divertidos e personalização com a identidade do evento. Para quem busca um clima rústico e sofisticado ao mesmo tempo.', itens: ['Fotos impressas na hora', 'Estética retrô em madeira', 'Acessórios divertidos', 'Link para baixar as fotos'] },
    galeria: { titulo: 'Momentos reais no Lambe-Lambe Retrô', fotos: ['L80', 'L82', 'L81'] },
    impacto: { frase: 'Algumas lembranças merecem um toque de história.', sub: 'O clima de antigamente para um momento que é todo seu.' },
    faq: [tempo('o Lambe-Lambe'), P.acess, P.pers, P.receber],
    veja: ['cabine-vip', 'cabine-tradicional', 'paparazzi-varal'],
    seo: { title: 'Lambe-Lambe Retrô: cabine de fotos vintage em BH | Vivaze', description: 'Lambe-Lambe Retrô: câmera de madeira com foto impressa na hora e acessórios, para casamentos e eventos em BH. Peça seu orçamento.', h1: 'câmera de madeira com foto impressa na hora' },
  },
  {
    slug: 'totem-2-em-1', nome: 'Totem 2 em 1', nomeLista: 'Totem 2 em 1', familia: 'Totem', filtro: 'totens',
    artigo: 'o Totem 2 em 1', precisa: 'o totem',
    home: { foto: 'v14_25', pos: 'center 40%', frase: 'Foto e vídeo no mesmo totem' },
    lista: { foto: 'L117', pos: 'center 35%', texto: 'Foto e vídeo no mesmo equipamento, para guardar cada momento da festa de um jeito diferente. Vídeos com moldura, música, câmera lenta e boomerang.' },
    hero: { foto: 'p-totem-2em1', pos: 'center 30%', linha: 'Totem fotográfico que faz foto impressa e vídeo.' },
    descricao: { titulo: 'Foto para segurar, vídeo para rever', texto: 'No mesmo totem, os convidados escolhem: foto impressa na hora ou vídeo com moldura, música e efeitos de câmera lenta e boomerang. Tudo fica disponível na hora e, depois da festa, num link para rever e baixar.', itens: ['Foto impressa na hora', 'Vídeo com música e moldura', 'Câmera lenta e boomerang', 'Link para baixar tudo'] },
    galeria: { titulo: 'Momentos reais no Totem 2 em 1', fotos: ['L115', 'v14_75', 'L116', 'v14_50'] },
    impacto: { frase: 'Duas formas de guardar o mesmo sorriso.', sub: 'Cada convidado escolhe na tela se quer foto impressa ou vídeo.' },
    faq: [tempo('o totem'), P.limiteFV, P.pers, P.receberFV],
    veja: ['totem-foto-lembranca', 'totem-foto-divertida', 'cabine-360'],
    seo: { title: 'Totem fotográfico com foto e vídeo em BH | Vivaze', description: 'Totem fotográfico com foto impressa e vídeo com música, câmera lenta e boomerang para festas e eventos em BH. Peça seu orçamento.', h1: 'totem fotográfico com foto e vídeo' },
  },
  {
    slug: 'totem-foto-lembranca', nome: 'Totem Foto Lembrança', nomeLista: 'Totem Foto Lembrança', familia: 'Totem', filtro: 'totens',
    artigo: 'o Totem Foto Lembrança', precisa: 'o totem',
    home: { foto: 'L125', pos: 'center 30%', frase: 'Compacto, com tela touch' },
    lista: { foto: 'L122', pos: 'center 40%', texto: 'Totem fotográfico compacto, com ring light e tela touch. A foto sai impressa em poucos segundos.' },
    hero: { foto: 'L119', pos: 'center 30%', linha: 'Totem fotográfico com ring light, tela touch e foto impressa em poucos segundos.' },
    descricao: { titulo: 'Cabe em qualquer canto do salão', texto: 'Estrutura compacta com ring light e tela touch: o convidado se vê, faz a pose e recebe a foto impressa em poucos segundos, personalizada com a identidade do seu evento. Depois da festa, todo mundo revê e baixa as fotos pelo link.', itens: ['Ring light', 'Tela touch', 'Fotos em poucos segundos', 'Link para baixar as fotos'] },
    galeria: { titulo: 'Momentos reais no Totem Foto Lembrança', fotos: ['L123', 'L121', 'L124', 'L120'] },
    impacto: { frase: 'Pequeno no espaço, grande na lembrança.', sub: 'Cada convidado leva para casa um pedaço do seu evento.' },
    faq: [tempo('o totem'), P.limite, P.pers, P.duram],
    veja: ['totem-2-em-1', 'totem-foto-divertida', 'cabine-tradicional'],
    seo: { title: 'Totem fotográfico com impressão na hora em BH | Vivaze', description: 'Totem fotográfico compacto com ring light, tela touch e foto impressa em poucos segundos para eventos em BH. Peça seu orçamento.', h1: 'totem fotográfico com impressão na hora' },
  },
  {
    slug: 'totem-foto-divertida', nome: 'Totem Foto Divertida', nomeLista: 'Totem Foto Divertida', familia: 'Totem', filtro: 'totens',
    artigo: 'o Totem Foto Divertida', precisa: 'o totem',
    home: { foto: 'L14', pos: 'center 30%', frase: 'Simples e sempre pronto' },
    lista: { foto: 'L109', pos: 'center 40%', texto: 'Simples, compacto e sempre pronto para registrar os momentos da festa, com acessórios divertidos e fotos impressas na hora.' },
    hero: { foto: 'L103', pos: 'center 45%', linha: 'Totem de fotos com acessórios divertidos e impressão na hora.' },
    descricao: { titulo: 'Diversão que cabe em qualquer espaço', texto: 'Um totem prático, com acessórios divertidos e fotos impressas na hora, personalizadas com a identidade do evento. Montamos tudo, um assistente orienta os convidados e, depois, todo mundo revê e baixa as fotos pelo link.', itens: ['Fotos impressas na hora', 'Acessórios divertidos', 'Foto personalizada', 'Link para baixar as fotos'] },
    galeria: { titulo: 'Momentos reais no Totem Foto Divertida', fotos: ['g-totem-corrida', 'L110', 'L107', 'L108'] },
    impacto: { frase: 'Diversão sem complicação.', sub: 'A gente monta tudo e cuida dos convidados. Você só aproveita.' },
    faq: [tempo('o totem'), P.acess, P.limite, P.receber],
    veja: ['totem-foto-lembranca', 'totem-2-em-1', 'cabine-tradicional'],
    seo: { title: 'Totem de fotos para festas em BH | Vivaze', description: 'Totem de fotos com acessórios divertidos e impressão na hora para festas e eventos em BH e região. Peça seu orçamento.', h1: 'totem de fotos com acessórios' },
  },
  {
    slug: 'paparazzi-varal', nome: 'Paparazzi + Varal', nomeLista: 'Paparazzi + Varal de Fotos', familia: 'Paparazzi', filtro: 'paparazzi',
    artigo: 'o Paparazzi + Varal', precisa: 'o serviço',
    home: { foto: 'p-paparazzi', pos: 'center 40%', frase: 'Um fotógrafo entre os convidados e as fotos impressas no varal' },
    lista: { foto: 'L88', pos: 'center 40%', texto: 'Um fotógrafo circulando entre os convidados, flagrando os momentos espontâneos e verdadeiros. As fotos são impressas no dia e entregues num varal.' },
    hero: { foto: 'L97', pos: 'center 40%', linha: 'Um fotógrafo circula pela festa, e as fotos são impressas e penduradas num varal ainda durante o evento.' },
    descricao: { titulo: 'Do flagra ao varal, no mesmo dia', texto: 'Enquanto a festa acontece, nosso fotógrafo registra os momentos espontâneos com equipamento profissional. As fotos são personalizadas e impressas numa ilha no próprio evento e vão para um varal, de onde cada convidado leva a sua para casa.', itens: ['Fotógrafo profissional', 'Impressão no próprio evento', 'Varal de fotos', 'Link para baixar tudo'] },
    galeria: { titulo: 'Momentos reais com o Paparazzi', fotos: ['L90', 'L93', 'L100', 'L98'] },
    impacto: { frase: 'Os melhores momentos são os que ninguém posou.', sub: 'A gente registra o que já é real, sem interromper a festa.' },
    faq: [tempo('o fotógrafo'), P.ilha, P.pers, P.receber],
    veja: ['cabine-tradicional', 'cabine-vip', 'espelho-magico'],
    seo: { title: 'Fotógrafo de festa com foto impressa na hora em BH | Vivaze', description: 'Fotógrafo circulando entre os convidados, com fotos impressas no evento e entregues num varal. Para festas e eventos em BH. Peça seu orçamento.', h1: 'fotógrafo entre os convidados e fotos impressas no evento' },
  },
];

export const servico = (slug: string) => {
  const s = servicos.find((x) => x.slug === slug);
  if (!s) throw new Error(`Serviço não encontrado: ${slug}`);
  return s;
};

export const filtros = [
  ['todos', 'Todos'], ['cabinephoto', 'CabinePhoto'], ['experiencias', 'Experiências'], ['totens', 'Totens'], ['paparazzi', 'Paparazzi'],
] as const;
