import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// @ts-ignore
import { version } from './package.json';

dotenvConfig({ path: '../../.env' });

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    define: {
      _app_version: JSON.stringify(version)
    },
    base: './',
    plugins: [
      react({
        babel: {
          babelrc: true
        }
      }),
      checker({ typescript: true }),
      legacy({
        targets: ['defaults', 'IE 11']
      })
    ],
    resolve: {
      alias: [
        { find: /^~@arco-design/, replacement: resolve(__dirname, './node_modules/@arco-design/') },
        { find: /^@\//, replacement: resolve(__dirname, './src') + '/' }
      ]
    },
    server: {
      port: Number(process.env.RENDERER_DEV_PORT)
    }
  };
});
