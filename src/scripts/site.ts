// Comportamentos do site: menu mobile, carrossel de depoimentos, filtros e formulário.

/* ---------- menu mobile ---------- */
const menu = document.getElementById('menu-mobile');
const abrir = document.querySelector<HTMLButtonElement>('[data-menu-open]');
if (menu && abrir) {
  const foco = () => Array.from(menu.querySelectorAll<HTMLElement>('a[href], button'));
  const fechar = (devolver = true) => {
    menu.dataset.open = 'false';
    abrir.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (devolver) abrir.focus();
  };
  abrir.addEventListener('click', () => {
    menu.dataset.open = 'true';
    abrir.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    foco()[1]?.focus();
  });
  menu.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => fechar(el.tagName === 'BUTTON')));
  menu.querySelectorAll('nav a').forEach((el) => el.addEventListener('click', () => fechar(false)));
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fechar();
    if (e.key !== 'Tab') return;
    const itens = foco();
    const primeiro = itens[0];
    const ultimo = itens[itens.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });
}

/* ---------- carrossel de depoimentos (desktop: 3 visíveis, anda 1) ---------- */
document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((raiz) => {
  const trilho = raiz.querySelector<HTMLElement>('[data-track]');
  const prev = raiz.querySelector<HTMLButtonElement>('[data-prev]');
  const next = raiz.querySelector<HTMLButtonElement>('[data-next]');
  const contador = raiz.querySelector<HTMLElement>('[data-counter]');
  if (!trilho || !prev || !next) return;
  const cartoes = Array.from(trilho.children) as HTMLElement[];
  const visiveis = 3;
  let i = 0;
  const desktop = window.matchMedia('(min-width: 1024px)');
  const pintar = () => {
    if (!desktop.matches) { trilho.style.transform = ''; return; }
    const passo = cartoes[0].getBoundingClientRect().width + 24;
    trilho.style.transform = `translateX(${-i * passo}px)`;
    prev.disabled = i === 0;
    next.disabled = i >= cartoes.length - visiveis;
    if (contador) contador.textContent = `${i + 1}–${i + visiveis} de ${cartoes.length}`;
    cartoes.forEach((c, n) => c.toggleAttribute('inert', n < i || n >= i + visiveis));
  };
  prev.addEventListener('click', () => { i = Math.max(0, i - 1); pintar(); });
  next.addEventListener('click', () => { i = Math.min(cartoes.length - visiveis, i + 1); pintar(); });
  desktop.addEventListener('change', () => { cartoes.forEach((c) => c.removeAttribute('inert')); pintar(); });
  window.addEventListener('resize', pintar);
  pintar();
});

/* ---------- filtros (Serviços e Blog) ---------- */
document.querySelectorAll<HTMLElement>('[data-filters]').forEach((grupo) => {
  const alvo = document.querySelector<HTMLElement>(grupo.dataset.filters!);
  if (!alvo) return;
  const botoes = Array.from(grupo.querySelectorAll<HTMLButtonElement>('button[data-filter]'));
  const itens = Array.from(document.querySelectorAll<HTMLElement>(`${grupo.dataset.filters} [data-cat], [data-filter-scope="${grupo.dataset.filters}"] [data-cat]`));
  const aviso = document.querySelector<HTMLElement>(`[data-filter-status="${grupo.dataset.filters}"]`);
  botoes.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter!;
    botoes.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    let n = 0;
    itens.forEach((it) => { const mostra = f === 'todos' || it.dataset.cat === f; it.hidden = !mostra; if (mostra) n++; });
    document.querySelectorAll<HTMLElement>('[data-hide-when-filtered]').forEach((el) => { el.hidden = f !== 'todos' && !el.querySelector('[data-cat]:not([hidden])'); });
    document.querySelectorAll<HTMLElement>('[data-only-all]').forEach((el) => { el.hidden = f !== 'todos'; });
    if (aviso) aviso.textContent = f === 'todos' ? '' : `${n} ${n === 1 ? 'item' : 'itens'} em ${b.textContent}`;
  }));
});

/* ---------- formulário de orçamento ---------- */
const form = document.querySelector<HTMLFormElement>('[data-form]');
if (form) {
  const campo = (n: string) => form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | null;
  const tel = campo('telefone') as HTMLInputElement;
  const data = campo('data_evento') as HTMLInputElement;
  const tipo = campo('tipo_evento') as HTMLSelectElement;
  const linhaEmpresa = form.querySelector<HTMLElement>('[data-empresa]');
  const aviso = form.querySelector<HTMLElement>('[data-notice]');
  const botao = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const rotulo = botao.querySelector<HTMLElement>('[data-label]')!;
  const comEmpresa = (form.dataset.empresaTipos || '').split('|');

  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = d.length <= 2 ? (d ? `(${d}` : '') : d.length <= 6 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d.length <= 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  });
  data?.addEventListener('input', () => {
    const d = data.value.replace(/\D/g, '').slice(0, 8);
    data.value = d.length <= 2 ? d : d.length <= 4 ? `${d.slice(0, 2)}/${d.slice(2)}` : `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  });
  tipo?.addEventListener('change', () => { if (linhaEmpresa) linhaEmpresa.hidden = !comEmpresa.includes(tipo.value); });
  form.querySelectorAll<HTMLSelectElement>('select').forEach((s) => {
    const pinta = () => { s.dataset.empty = String(!s.value); };
    s.addEventListener('change', pinta); pinta();
  });

  const dataValida = (v: string) => {
    const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return false;
    const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const dt = new Date(a, mes - 1, d);
    return dt.getFullYear() === a && dt.getMonth() === mes - 1 && dt.getDate() === d;
  };
  const regras: [string, (v: string) => boolean][] = [
    ['nome', (v) => v.trim().length > 1],
    ['telefone', (v) => v.replace(/\D/g, '').length >= 10],
    ['cidade_evento', (v) => !!v],
    ['data_evento', dataValida],
  ];
  const marcar = (el: HTMLElement, ok: boolean) => {
    el.setAttribute('aria-invalid', String(!ok));
    const erro = form.querySelector<HTMLElement>(`[data-error-for="${el.getAttribute('name')}"]`);
    if (erro) erro.dataset.show = String(!ok);
  };
  const validar = () => {
    let faltam = 0;
    let primeiro: HTMLElement | null = null;
    regras.forEach(([n, ok]) => {
      const el = campo(n)!;
      const valido = ok(el.value);
      marcar(el, valido);
      if (!valido) { faltam++; primeiro ??= el; }
    });
    const email = campo('email') as HTMLInputElement;
    const emailOk = !email.value || /^\S+@\S+\.\S+$/.test(email.value);
    marcar(email, emailOk);
    if (!emailOk) { faltam++; primeiro ??= email; }
    const consent = campo('consentimento') as HTMLInputElement;
    consent.setAttribute('aria-invalid', String(!consent.checked));
    if (!consent.checked) { faltam++; primeiro ??= consent; }
    if (aviso) {
      aviso.dataset.show = String(faltam > 0);
      const t = aviso.querySelector('strong');
      const s = aviso.querySelector('span');
      if (t) t.textContent = faltam === 1 ? 'Confira o campo destacado' : `Confira os ${faltam} campos destacados`;
      if (s) s.textContent = 'Faltam informações obrigatórias para enviar o pedido.';
    }
    return primeiro;
  };
  form.addEventListener('input', (e) => {
    const el = e.target as HTMLElement;
    if (el.getAttribute('aria-invalid') === 'true') validar();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if ((campo('website') as HTMLInputElement)?.value) return; // honeypot
    const primeiro = validar();
    if (primeiro) { primeiro.focus(); return; }
    botao.disabled = true;
    rotulo.textContent = 'Enviando…';
    // PRÉVIA: o envio é simulado. Para ligar ao Vivaze CRM, trocar este bloco por um
    // fetch('/api/orcamento', { method: 'POST', body: new FormData(form) }) e tratar a falha.
    await new Promise((r) => setTimeout(r, 900));
    const nome = (campo('nome')!.value.trim().split(/\s+/)[0]) || '';
    const canal = campo('preferencia_recebimento_orcamento')!.value;
    const frases: Record<string, string> = { WhatsApp: 'pelo WhatsApp, como você preferiu', 'E-mail': 'por e-mail, como você preferiu', 'Ligação rápida': 'por telefone, como você preferiu' };
    const texto = form.querySelector<HTMLElement>('[data-done-text]');
    if (texto) texto.textContent = `Obrigado, ${nome}. Recebemos seu pedido de orçamento e vamos responder rápido${canal ? ` ${frases[canal]}` : ''}.`;
    const conv = campo('convidados')!.value;
    const resumo = [tipo.value, data.value, campo('cidade_evento')!.value, conv ? `${conv} convidados` : ''].filter(Boolean).join(' · ');
    const r = form.querySelector<HTMLElement>('[data-done-summary]');
    if (r) r.textContent = resumo;
    form.dataset.state = 'done';
    form.querySelector<HTMLElement>('[data-done]')?.focus();
    botao.disabled = false;
    rotulo.textContent = 'Solicitar orçamento';
  });
  form.querySelector('[data-again]')?.addEventListener('click', () => {
    form.reset();
    form.dataset.state = '';
    if (linhaEmpresa) linhaEmpresa.hidden = true;
    form.querySelectorAll<HTMLSelectElement>('select').forEach((s) => { s.dataset.empty = 'true'; });
    campo('nome')?.focus();
  });
}
