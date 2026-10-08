# Site Vivaze

Site da Vivaze feito em [Astro](https://astro.build), com CSS próprio a partir dos tokens do design system. São 18 páginas estáticas: Home, Serviços, 10 páginas de serviço, Eventos corporativos, Eventos sociais, Blog, 2 artigos e 404.

## Rodar no computador

Precisa do Node 22 ou mais novo.

```
npm install
npm run dev
```

O site abre em `http://localhost:4321`. Para gerar a versão final, `npm run build` (sai na pasta `dist`).

## Publicar a prévia na Vercel

Na pasta do projeto:

```
npx vercel
```

Na primeira vez o comando abre o navegador para você entrar na sua conta e pergunta o nome do projeto. A Vercel reconhece o Astro sozinha e devolve o link da prévia. Para atualizar a prévia depois de uma mudança, rode `npx vercel` de novo.

Outra forma: subir a pasta para um repositório no GitHub e importar o repositório em vercel.com/new.

## Prévia x site no ar

Enquanto a variável `PUBLIC_INDEXAR` não for `1`, todas as páginas saem com `noindex, nofollow` e o Google não indexa a prévia. Na hora do lançamento, defina na Vercel (Settings → Environment Variables):

| Variável | Valor | Para quê |
| --- | --- | --- |
| `SITE_URL` | endereço final, ex. `https://www.vivaze.com.br` | canonical e Open Graph |
| `PUBLIC_INDEXAR` | `1` | libera a indexação |

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Telefone, e-mail, Instagram, cidades, tipos de evento, clientes, depoimentos | `src/data/site.ts` |
| Textos, fotos, FAQ e SEO de cada serviço | `src/data/servicos.ts` |
| Texto alternativo das fotos | `src/data/fotos.ts` |
| Artigos do blog (um `.md` por artigo) | `src/blog/` |
| Home, Serviços, Eventos, Blog e 404 | `src/pages/` |
| Cabeçalho, rodapé, formulário, carrossel | `src/components/` |
| Cores, tipografia e espaçamentos | `src/styles/global.css` (bloco `:root`) |
| Menu, carrossel, filtros e formulário | `src/scripts/site.ts` |
| Fotos, logos de clientes e retratos | `src/assets/` |

Para criar um artigo, copie um dos `.md` de `src/blog/`, troque o nome do arquivo (ele vira o endereço) e ajuste o cabeçalho. Para trocar uma foto, substitua o arquivo em `src/assets/fotos/` mantendo o nome, ou aponte para outro nome no arquivo de dados.

## Formulário de orçamento

O formulário envia por `fetch` para `/api/orcamento.php` (arquivo `public/api/orcamento.php`, copiado para a hospedagem HostGator junto com o site). O PHP valida de novo os campos, aplica o antispam (honeypot `website`, tempo mínimo de preenchimento, limite de 5 envios por IP a cada 10 min e checagem de origem `vivaze.com.br`) e repassa o pedido ao Vivaze CRM (`https://cabinefoto.com.br/vivaze-crm/public/pedido_orcamento.php`) por cURL. Convidados e empresa vão no início de `mensagem`, porque o CRM não tem campos para eles.

Se o CRM falhar, o pedido é gravado em `vivaze-logs/pedidos-nao-enviados.log` (uma pasta acima da pasta pública) e, se `ALERT_EMAIL` estiver preenchido no PHP, enviado por e-mail. O site mostra um aviso de erro para o visitante.

Pendências antes de publicar:

1. `ALERT_EMAIL` já está com vivaze01@gmail.com; conferir se `ALERT_FROM` (site@vivaze.com.br) é um e-mail válido do domínio e se o aviso não cai no spam.
2. Fazer um envio de teste real e ajustar o trecho `TODO` do PHP: hoje "sucesso" é qualquer resposta HTTP 2xx/3xx do CRM; o ideal é o CRM devolver JSON ou o PHP checar a mensagem da página. As respostas ficam em `vivaze-logs/crm-respostas.log`.
3. Chave secreta no CRM (hoje o endpoint é público, protegido só pelo honeypot) e campos novos para convidados, empresa, origem e consentimento.

Em `npm run dev` o `/api/orcamento.php` não existe, então o envio mostra a mensagem de erro; para testar de ponta a ponta, publique na hospedagem (ou rode `php -S` com a pasta `dist`).

## Pendências de conteúdo

- Instagram: rótulo e link estão como `Instagram [@a definir]` em `src/data/site.ts`.
- E-mail `contato@vivaze.com`: a confirmar.
- Política de Privacidade: página criada em `src/pages/politica-de-privacidade.astro` (rascunho; pedir revisão jurídica e confirmar razão social, CNPJ e e-mail de contato).
- Lambe-Lambe Retrô: falta uma foto na galeria (aparece o espaço reservado).
- Endereço da empresa: o dado estruturado `LocalBusiness` da Home está só com cidade e estado.
- Algumas fotos têm resolução baixa e ficam suaves em telas grandes.
- Tablet (768 a 1023 px): segue as regras do design system, sem tela desenhada no Figma.
