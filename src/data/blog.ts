// Artigos do blog: cada arquivo .md em src/blog vira uma página em /blog/<nome-do-arquivo>.
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

export interface Artigo {
  slug: string;
  Content: AstroComponentFactory;
  titulo: string; tituloSeo: string; descricao: string; resumo: string;
  categoria: string; cat: string; data: string; dataRotulo: string; leitura: string; autor: string; capa: string; ordem: number;
  cta: { titulo: string; texto: string; link: string; linkRotulo: string };
  fontes: string[];
}

const mods = import.meta.glob<any>('../blog/*.md', { eager: true });

export const artigos: Artigo[] = Object.entries(mods)
  .map(([arquivo, m]) => ({ slug: arquivo.split('/').pop()!.replace(/\.md$/, ''), Content: m.Content, ...m.frontmatter }))
  .sort((a, b) => a.ordem - b.ordem);
