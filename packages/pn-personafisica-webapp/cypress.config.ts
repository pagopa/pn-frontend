import { defineConfig } from 'cypress';

const webpackPreprocessor = require('@cypress/webpack-preprocessor');

const webpackOptions = require('./cypress/webpack.config');

export default defineConfig({
  e2e: {
    baseUrl: 'https://portale.dev.pn.pagopa.it',
    // defaultCommandTimeout: 30000,
    // requestTimeout: 30000,
    setupNodeEvents(on, config) {
      // setting up excludeSpecPattern
      let excludeSpecPattern = [];
      const initialExcludePattern = config.excludeSpecPattern;

      if (typeof initialExcludePattern === "string") {
        excludeSpecPattern.push(initialExcludePattern);
      } else {
        excludeSpecPattern = [initialExcludePattern];
      }

      if(config.isTextTerminal){ // cypress launched using run
        excludeSpecPattern.push('cypress/e2e/All.cy.ts');
      }

      // webpack config
      if (!webpackOptions) {
        throw new Error('Could not find Webpack in this project');
      }

      const options = {
        webpackOptions,
        watchOptions: {}
      };

      on('file:preprocessor', webpackPreprocessor(options));

      return {
        ...config,
        excludeSpecPattern
      };
    },
  },
});
