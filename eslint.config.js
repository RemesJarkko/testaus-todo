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

  // Cypress end-to-end tests: provide Mocha and Cypress globals
  {
    files: ['cypress/**/*.js', 'cypress/**/*.cy.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.cypress,
      },
    },
  },
]);
