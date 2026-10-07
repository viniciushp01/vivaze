// SÓ PARA A PRÉVIA NA VERCEL. Em produção (HostGator) quem responde em /api/orcamento.php é o
// public/api/orcamento.php de verdade. Esta função existe para o formulário poder ser testado
// no link da Vercel, e o vercel.json remove o PHP do build de lá.
//
// Por padrão é um ENSAIO: valida e responde ok, sem enviar nada ao CRM. Para enviar de verdade
// ao CRM, definir a variável de ambiente CRM_FORWARD=1 no projeto da Vercel.
const CRM_URL = 'https://cabinefoto.com.br/vivaze-crm/public/pedido_orcamento.php';

const j = (status, corpo) => Response.json(corpo, { status, headers: { 'Cache-Control': 'no-store' } });
const limpar = (v, max) => (typeof v === 'string' ? v.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, max) : '');

export function GET() {
  return j(405, { ok: false, erro: 'metodo' });
}

export async function POST(request) {
  let fd;
  try { fd = await request.formData(); } catch { return j(400, { ok: false, erro: 'corpo' }); }
  const g = (n, max) => limpar(fd.get(n), max);

  if (g('website', 200)) return j(200, { ok: true }); // honeypot

  const nome = g('nome', 120), email = g('email', 160), telefone = g('telefone', 16);
  const cidade = g('cidade_evento', 80), data = g('data_evento', 10), tipo = g('tipo_evento', 60);
  const canal = g('preferencia_recebimento_orcamento', 40), empresa = g('empresa', 120);
  const conv = g('convidados', 40), mensagem = g('mensagem', 2000);

  const erros = [];
  if (nome.length < 2) erros.push('nome');
  if (telefone.replace(/\D/g, '').length < 10) erros.push('telefone');
  if (!cidade) erros.push('cidade_evento');
  const m = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const dt = m && new Date(+m[3], +m[2] - 1, +m[1]);
  if (!m || dt.getFullYear() !== +m[3] || dt.getMonth() !== +m[2] - 1 || dt.getDate() !== +m[1]) erros.push('data_evento');
  if (email && !/^\S+@\S+\.\S+$/.test(email)) erros.push('email');
  if (!fd.get('consentimento')) erros.push('consentimento');
  if (erros.length) return j(422, { ok: false, erro: 'validacao', campos: erros });

  const cab = [empresa && `Empresa: ${empresa}`, conv && `Convidados: ${conv}`].filter(Boolean).join(' | ');
  const campos = {
    nome, email, telefone, cidade_evento: cidade, data_evento: data, tipo_evento: tipo,
    preferencia_recebimento_orcamento: canal, mensagem: [cab, mensagem].filter(Boolean).join('\n\n'), website: '',
  };

  if (process.env.CRM_FORWARD !== '1') {
    console.log('[ensaio] pedido validado, NÃO enviado ao CRM:', JSON.stringify(campos));
    return j(200, { ok: true, ensaio: true });
  }
  try {
    const r = await fetch(CRM_URL, {
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'VivazeSite/1.0' },
      body: new URLSearchParams(campos),
    });
    const ok = r.status < 400 || r.type === 'opaqueredirect';
    console.log('[crm] status', r.status, ok ? 'ok' : 'FALHA');
    return ok ? j(200, { ok: true }) : j(502, { ok: false, erro: 'crm' });
  } catch (e) {
    console.log('[crm] erro', String(e));
    return j(502, { ok: false, erro: 'crm' });
  }
}
