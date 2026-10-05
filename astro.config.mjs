import { defineConfig } from 'astro/config';

// SITE_URL: endereço final do site (ex.: https://www.vivaze.com.br).
// Enquanto não estiver definido, as páginas saem sem canonical e com noindex.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
});
