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

Nesta prévia o envio é **simulado**: o formulário valida os campos e mostra a tela de confirmação, mas não manda nada para lugar nenhum.

Os campos já usam os nomes do Vivaze CRM: `nome`, `email`, `telefone`, `cidade_evento`, `data_evento`, `tipo_evento`, `empresa`, `convidados`, `preferencia_recebimento_orcamento`, `mensagem`, `consentimento` e `website` (campo-isca contra robôs, fica escondido).

Para ligar ao CRM:

1. Criar uma rota no servidor, `/api/orcamento`, que recebe o formulário e repassa para `https://cabinefoto.com.br/vivaze-crm/public/pedido_orcamento.php`. Assim o endereço do CRM não fica exposto no navegador e dá para tratar erro e spam em um lugar só.
2. Em `src/scripts/site.ts`, trocar o trecho marcado com `PRÉVIA` por um `fetch('/api/orcamento', { method: 'POST', body: new FormData(form) })` e mostrar a mensagem de falha quando o envio não der certo.

## Pendências de conteúdo

- Instagram: rótulo e link estão como `Instagram [@a definir]` em `src/data/site.ts`.
- E-mail `contato@vivaze.com`: a confirmar.
- Política de Privacidade: o link ainda aponta para `#`.
- Lambe-Lambe Retrô: falta uma foto na galeria (aparece o espaço reservado).
- Endereço da empresa: o dado estruturado `LocalBusiness` da Home está só com cidade e estado.
- Algumas fotos têm resolução baixa e ficam suaves em telas grandes.
- Tablet (768 a 1023 px): segue as regras do design system, sem tela desenhada no Figma.
