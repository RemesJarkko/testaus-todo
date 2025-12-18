import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  // Default JS files to ESM (package.json has "type": "module")
  { files: ['**/*.js'], languageOptions: { sourceType: 'module' } },
  // Keep script mode for specific legacy files
  { files: ['server.js'], languageOptions: { sourceType: 'script' } },
]);
