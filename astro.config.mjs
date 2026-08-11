// @ts-check
import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

const LOCALES = ['en', 'zh'];

function sitemapSingle() {
  let config;
  return {
    name: 'sitemap-single',
    hooks: {
      'astro:config:done': ({ config: cfg }) => {
        config = cfg;
      },
      'astro:build:done': async ({ dir, pages, logger }) => {
        if (!config.site) {
          logger.warn('The sitemap integration requires the `site` option. Skipping.');
          return;
        }
        const today = new Date().toISOString().split('T')[0];
        const enPath = (p) =>
          p === '/' ? '/' : p.startsWith('/zh') ? p.slice(3) || '/' : p;
        const zhPath = (p) =>
          p === '/' ? '/zh/' : p.startsWith('/zh') ? p : '/zh' + p;

        const entries = new Map();
        for (const pg of pages) {
          let pathname = pg.pathname || '/';
          if (pathname.includes('.')) continue;
          if (!pathname.startsWith('/')) pathname = '/' + pathname;
          if (pathname !== '/' && !pathname.endsWith('/')) pathname += '/';
          for (const path of [enPath(pathname), zhPath(pathname)]) {
            if (!entries.has(path)) entries.set(path, { en: enPath(path), zh: zhPath(path) });
          }
        }

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
        for (const [path, alt] of entries) {
          const enHref = new URL(alt.en, config.site).href;
          const zhHref = new URL(alt.zh, config.site).href;
          xml += `<url><loc>${new URL(path, config.site).href}</loc><lastmod>${today}</lastmod>`;
          xml += `<xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>`;
          xml += `<xhtml:link rel="alternate" hreflang="zh" href="${zhHref}"/>`;
          xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${enHref}"/>`;
          xml += '</url>';
        }
        xml += '</urlset>';

        await writeFile(new URL('sitemap.xml', dir), xml);
        logger.info('`sitemap.xml` created at `dist`');
      },
    },
  };
}

function requestAdapterInfoDev() {
  return {
    name: 'replace-requestAdapterInfoDev',
    enforce: 'pre',
    apply: 'serve',
    transform(code, id) {
      // if (/await\s+(\w+)\.requestAdapterInfo\(\)/.test(code)) {
      if (/@imgly_background-removal\.js/.test(id)) {
        console.log(id);
        const replaced = code.replace(
          /await\s+(\w+)\.requestAdapterInfo\(\)/g,
          `$1.info`
        );
        return {
          code: replaced,
          map: null,
        };
      }
    },
  };
}

function requestAdapterInfoBuild() {
  return {
    name: 'replace-requestAdapterInfoBuild',
    enforce: 'pre',
    apply: 'build',
    transform(code, id) {
      if (/ort\.webgpu\.min\.js$/.test(id)) {
        console.log(id);
        const replaced = code.replace(
          /await\s+(\w+)\.requestAdapterInfo\(\)/g,
          // `$1.requestAdapterInfo?await $1.requestAdapterInfo():$1.info||{vendor:'unknown',architecture:'unknown',description:'shim'}`
          `$1.info`
        );
        return {
          code: replaced,
          map: null,
        };
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://bgg.one',
  markdown: {
    shikiConfig: {
      theme: 'andromeeda',
    },
  },
  integrations: [react(), sitemapSingle()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
      // requestAdapterInfoDev(),
      // requestAdapterInfoBuild(),
    ],
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  },
});
