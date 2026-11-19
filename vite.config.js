import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import copy from './src/content/layout/document.json' with {type: 'json'};

const localServer = {host: '127.0.0.1', port: 8765, strictPort: true};

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    {
      name: 'document-metadata',
      transformIndexHtml() {
        return [
          {tag: 'title', children: copy.title, injectTo: 'head'},
          {tag: 'meta', attrs: {name: 'description', content: copy.description}, injectTo: 'head'},
        ];
      },
    },
  ],
  server: localServer,
  preview: localServer,
});
