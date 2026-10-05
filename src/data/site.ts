// Dados gerais do site. Itens marcados com "a definir" esperam confirmação do cliente.
export const site = {
  nome: 'Vivaze',
  telefone: '(31) 97239-2199',
  telefoneLink: '+5531972392199',
  whatsapp: '5531972392199',
  email: 'contato@vivaze.com', // a confirmar
  regiao: 'Belo Horizonte e Região Metropolitana',
  instagramRotulo: 'Instagram [@a definir]',
  instagramUrl: '#', // a definir
  privacidadeUrl: '#', // página de Política de Privacidade ainda não existe
  assinatura: 'Foto, vídeo e entretenimento para eventos. Você merece ser lembrado assim.',
};

export function whatsappLink(mensagem = 'Olá! Vim pelo site da Vivaze e quero um orçamento.') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const cidades = [
  'Belo Horizonte', 'Betim', 'Brumadinho', 'Caeté', 'Confins', 'Contagem', 'Esmeraldas', 'Florestal', 'Ibirité',
  'Igarapé', 'Itabirito', 'Itaguara', 'Itaúna', 'Jaboticatubas', 'Juatuba', 'Lagoa Santa', 'Macacos', 'Mariana',
  'Mateus Leme', 'Nova Lima', 'Nova Serrana', 'Pedro Leopoldo', 'Prudente de Morais', 'Raposos', 'Ribeirão das Neves',
  'Rio Acima', 'Sabará', 'Santa Luzia', 'São Joaquim de Bicas', 'Sarzedo', 'Sete Lagoas', 'Vespasiano', 'Outra cidade',
];

export const tiposEvento = [
  'Aniversário', 'Aniversário Infantil', 'Batizado', 'Chá de Revelação', 'Casamento', 'Corporativo', '15 anos',
  'Formatura', 'Ação de Marketing', 'Evento cultural', 'Evento Esportivo', 'Feira', 'Renovação de Votos', 'Outro',
];

// Tipos de evento que mostram o campo Empresa no formulário
export const tiposComEmpresa = ['Corporativo', 'Ação de Marketing', 'Feira', 'Evento cultural', 'Evento Esportivo'];

export const faixasConvidados = ['Até 50', '50 a 100', '100 a 200', '200 a 400', 'Mais de 400'];
export const canais = ['Ligação rápida', 'WhatsApp', 'E-mail'];

export const clientes = [
  ['alobebe_logo', 'Alô Bebê'], ['banco_brasil_logo', 'Banco do Brasil'], ['caixa_logo', 'Caixa'],
  ['direcional_logo', 'Direcional Vendas'], ['felicioroxo_logo', 'Hospital Felício Rocho'], ['fiemg_logo', 'Sistema FIEMG'],
  ['ibis_logo', 'ibis'], ['labtest_logo', 'Labtest'], ['lar_imoveis_logo', 'Lar Imóveis'], ['patrus_logo', 'Patrus Transportes'],
  ['policia_federal_logo', 'Polícia Rodoviária Federal'], ['policia_logo', 'Polícia Militar de Minas Gerais'],
  ['santa_cruz_logo', 'Santa Cruz'], ['sesc_logo', 'Sesc'], ['vale_logo', 'Vale'],
] as const;

export const depoimentos = [
  { nome: 'Isabela Moraes', foto: 'testimonial_isabelamorais', contexto: 'Casamento · Betim', texto: 'O atendimento foi impecável desde a contratação até o dia! Eles se preocupam com a nossa satisfação, fazem todas as artes personalizadas, são detalhistas ao extremo. Indico de olhos fechados!' },
  { nome: 'Daniela De Fatima', foto: 'testimonial_daniela_de_fatima', contexto: '', texto: 'Foi maravilhoso. Guardamos momentos que o tempo não vai apagar! Obrigada, Pierre! Você foi atencioso do primeiro contato até o pós-evento. Muito obrigada por tudo e por tanto!' },
  { nome: 'Walter Junior', foto: 'testimonial_walter', contexto: '', texto: 'O Pietri foi muito atencioso e paciente: tivemos que ajustar o local da instalação por causa da chuva que nos surpreendeu, e no final foi tudo perfeito. As meninas curtiram e as crianças também.' },
  { nome: 'Francielly Aquino', foto: 'testimonial_francielly', contexto: 'Casamento', texto: 'Vocês registraram momentos divertidos, espontâneos e cheios de sorrisos, criando lembranças únicas não só para nós, mas para todos os nossos convidados. Obrigado por toda dedicação, carinho e profissionalismo!' },
  { nome: 'Vanessa Marques', foto: 'testimonial_vanessa_marques', contexto: '', texto: 'Uma excelente experiência, desde o primeiro contato pelo WhatsApp até o dia da festa. Profissionais educados, super atenciosos. Recomendo de olhos fechados.' },
  { nome: 'Larissa S. Moreira', foto: 'testimonial_larissa_s_moreira', contexto: '', texto: 'Excelente prestador de serviço. Responde rápido, pontual para iniciar e finalizar, equipe de atendimento cordial e gentil.' },
  { nome: 'Vanessa Lamounier', foto: 'testimonial_vanessa_lamounier', contexto: '', texto: 'Atendimento top, fotógrafo excelente, cabine super legal. Super indico!' },
  { nome: 'Gustavo Algusto', foto: 'testimonial_gustavoalgusto', contexto: '', texto: 'Entrega no prazo, serviço de qualidade e humanizado. Foi uma indicação de um amigo e agora sou eu que vou indicar. Super confiável.' },
];
