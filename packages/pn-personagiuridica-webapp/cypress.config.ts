import { defineConfig } from 'cypress';

const webpackPreprocessor = require('@cypress/webpack-preprocessor');

const webpackOptions = require('./cypress/webpack.config');

export default defineConfig({
  e2e: {
    baseUrl: 'https://portale-pg.dev.pn.pagopa.it',
    // defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {
      // setting up excludeSpecPattern
      let excludeSpecPattern = [];
      const initialExcludePattern = config.excludeSpecPattern;

      if (typeof initialExcludePattern === 'string') {
        excludeSpecPattern.push(initialExcludePattern);
      } else {
        excludeSpecPattern = [initialExcludePattern];
      }

      if (config.isTextTerminal) {
        // cypress launched using run
        excludeSpecPattern.push('cypress/e2e/All.cy.ts');
      }

      // webpack config
      if (!webpackOptions) {
        throw new Error('Could not find Webpack in this project');
      }

      const options = {
        webpackOptions,
        watchOptions: {},
      };

      on('before:browser:launch', (browser, launchOptions) => {
          launchOptions.args.push('--disable-gpu')
          return launchOptions
      })

      on('file:preprocessor', webpackPreprocessor(options));

      // Decomment if you want log something to console
      // in test use cy.task('log', something-to-log)
      // Andrea Cimini, 2023.03.08
      /*
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      */

      return {
        ...config,
        excludeSpecPattern,
      };
    },
  },
});
