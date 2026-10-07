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

/* ---------- carrossel do hero (troca sozinho a cada 3 s; aceita rolagem horizontal) ---------- */
document.querySelectorAll<HTMLElement>('[data-hero-carousel]').forEach((raiz) => {
  const trilho = raiz.querySelector<HTMLElement>('[data-track]');
  const slides = Array.from(raiz.querySelectorAll<HTMLElement>('[data-slide]'));
  const pontos = Array.from(raiz.querySelectorAll<HTMLButtonElement>('[data-dot]'));
  if (!trilho || slides.length < 2) return;
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
  let atual = 0;
  let alvo: number | null = null; // destino de uma rolagem feita pelo código (ignora o "scroll" até chegar)
  let timer: number | undefined;
  const pintar = () => {
    slides.forEach((s, k) => s.setAttribute('aria-hidden', String(k !== atual)));
    pontos.forEach((p, k) => p.setAttribute('aria-current', String(k === atual)));
  };
  const ir = (n: number, suave = true) => {
    atual = (n + slides.length) % slides.length;
    alvo = atual;
    trilho.scrollTo({ left: atual * trilho.clientWidth, behavior: suave && !reduz.matches ? 'smooth' : 'auto' });
    pintar();
  };
  const parar = () => { window.clearInterval(timer); timer = undefined; };
  const tocar = () => {
    parar();
    if (reduz.matches || document.hidden) return;
    timer = window.setInterval(() => ir(atual + 1), 3000);
  };

  // rolagem feita pela pessoa: os pontos acompanham a foto que está na tela
  trilho.addEventListener('scroll', () => {
    const largura = trilho.clientWidth;
    if (alvo !== null) {
      if (Math.abs(trilho.scrollLeft - alvo * largura) < 2) { alvo = null; delete trilho.dataset.livre; }
      return;
    }
    const n = Math.round(trilho.scrollLeft / largura);
    if (n !== atual && n >= 0 && n < slides.length) { atual = n; pintar(); }
  }, { passive: true });
  trilho.addEventListener('touchstart', () => { alvo = null; parar(); }, { passive: true });
  trilho.addEventListener('touchend', tocar);
  trilho.addEventListener('touchcancel', tocar);
  trilho.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) alvo = null; }, { passive: true });

  // arrastar com o mouse
  let arrasto: { x: number; inicio: number } | null = null;
  trilho.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    alvo = null;
    arrasto = { x: e.clientX, inicio: trilho.scrollLeft };
    trilho.dataset.dragging = 'true';
    trilho.dataset.livre = 'true';
    trilho.setPointerCapture(e.pointerId);
  });
  trilho.addEventListener('pointermove', (e) => {
    if (arrasto) trilho.scrollLeft = arrasto.inicio - (e.clientX - arrasto.x);
  });
  const soltar = (e: PointerEvent) => {
    if (!arrasto) return;
    const dx = e.clientX - arrasto.x;
    const base = Math.round(arrasto.inicio / trilho.clientWidth);
    const limiar = trilho.clientWidth * 0.15;
    const destino = dx < -limiar ? base + 1 : dx > limiar ? base - 1 : base;
    arrasto = null;
    delete trilho.dataset.dragging;
    ir(Math.max(0, Math.min(slides.length - 1, destino)));
    window.setTimeout(() => { delete trilho.dataset.livre; }, 700);
  };
  trilho.addEventListener('pointerup', soltar);
  trilho.addEventListener('pointercancel', soltar);

  pontos.forEach((p, k) => p.addEventListener('click', () => { ir(k); tocar(); }));
  raiz.addEventListener('mouseenter', parar);
  raiz.addEventListener('mouseleave', tocar);
  raiz.addEventListener('focusin', parar);
  raiz.addEventListener('focusout', tocar);
  document.addEventListener('visibilitychange', tocar);
  reduz.addEventListener('change', tocar);
  window.addEventListener('resize', () => ir(atual, false));
  tocar();
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
  const marcaTempo = campo('t'); if (marcaTempo) marcaTempo.value = String(Date.now()); // antispam: tempo de preenchimento

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
    const falha = (titulo: string, msg: string) => {
      if (aviso) {
        aviso.dataset.show = 'true';
        const t = aviso.querySelector('strong'); const sp = aviso.querySelector('span');
        if (t) t.textContent = titulo;
        if (sp) sp.textContent = msg;
        aviso.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      botao.disabled = false;
      rotulo.textContent = 'Solicitar orçamento';
    };
    try {
      const res = await fetch('/api/orcamento.php', { method: 'POST', body: new FormData(form) });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        if (res.status === 429) return falha('Muitas tentativas', 'Aguarde alguns minutos e tente de novo, ou fale com a gente pelo WhatsApp.');
        return falha('Não foi possível enviar', 'Tente novamente em instantes ou fale com a gente pelo WhatsApp.');
      }
    } catch {
      return falha('Sem conexão', 'Não conseguimos enviar o pedido. Verifique a internet e tente de novo, ou fale com a gente pelo WhatsApp.');
    }
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
    if (marcaTempo) marcaTempo.value = String(Date.now());
    form.dataset.state = '';
    if (linhaEmpresa) linhaEmpresa.hidden = true;
    form.querySelectorAll<HTMLSelectElement>('select').forEach((s) => { s.dataset.empty = 'true'; });
    campo('nome')?.focus();
  });
}

/* ---------- vídeos em loop (mudos): tocam só quando aparecem na tela ---------- */
{
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]'));
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const economizar = !!conn && (conn.saveData === true || /(^|-)2g$|3g/.test(conn.effectiveType ?? ''));
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Com "reduzir movimento" ou conexão econômica, o vídeo fica parado na imagem de capa.
  if (videos.length && !reduzir && !economizar && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
      });
    }, { threshold: 0.35 });
    videos.forEach((v) => obs.observe(v));
  }
}

/* ---------- vídeo com som opcional: começa mudo e o botão "Ativar som" liga o áudio ---------- */
document.querySelectorAll<HTMLButtonElement>('[data-som]').forEach((btn) => {
  const v = btn.parentElement?.querySelector<HTMLVideoElement>('video');
  if (!v) return;
  const rotulo = btn.querySelector<HTMLElement>('[data-som-rotulo]');
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pintar = () => {
    const ligado = !v.muted;
    btn.setAttribute('aria-pressed', String(ligado));
    btn.dataset.on = String(ligado);
    if (rotulo) rotulo.textContent = ligado ? 'Desativar som' : 'Ativar som';
  };
  const silenciar = () => { v.muted = true; v.loop = true; pintar(); };
  btn.addEventListener('click', () => {
    if (v.muted) {
      // Com som, o vídeo recomeça do início e toca uma vez só.
      v.muted = false; v.loop = false; v.currentTime = 0;
      v.play().catch(() => { silenciar(); });
    } else {
      silenciar();
    }
    pintar();
  });
  // Terminou com som: volta ao loop mudo (ou para na capa, com "reduzir movimento").
  v.addEventListener('ended', () => { silenciar(); if (!reduzir) v.play().catch(() => {}); });
  // Saiu da tela com som ligado: pausa, para o áudio não seguir tocando.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (!e.isIntersecting && !v.muted) v.pause(); });
    }, { threshold: 0.1 }).observe(v);
  }
  pintar();
});
