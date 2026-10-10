
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'html/index.html'),
        projetos: resolve(process.cwd(), 'html/projetos.html'),
        cadastro: resolve(process.cwd(), 'html/cadastro.html'),
      },
    },
  },
});
