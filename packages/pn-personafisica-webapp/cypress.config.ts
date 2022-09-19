import { defineConfig } from 'cypress';

const webpackPreprocessor = require('@cypress/webpack-preprocessor');

const webpackOptions = require('./cypress/webpack.config');

export default defineConfig({
  e2e: {
    baseUrl: 'https://portale.dev.pn.pagopa.it',
    setupNodeEvents(on, config) {
      if (!webpackOptions) {
        throw new Error('Could not find Webpack in this project');
      }

      const options = {
        webpackOptions,
        watchOptions: {}
      };

      on('file:preprocessor', webpackPreprocessor(options));

      return config;
    },
  },
});
