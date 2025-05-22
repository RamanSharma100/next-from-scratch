import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'fs';

const inputMapPath = path.resolve(__dirname, './vite.inputs.json');

let inputMap: Record<string, string> = {};
if (existsSync(inputMapPath)) {
  const raw = readFileSync(inputMapPath, 'utf-8');
  inputMap = JSON.parse(raw);
}

export default defineConfig({
  root: path.resolve(__dirname, '../..'),
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: inputMap,
    },
    emptyOutDir: false,
  },
  plugins: [react()],
});
