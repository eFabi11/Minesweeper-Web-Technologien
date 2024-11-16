module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/sinon/pkg/sinon.js',

      //'public/javascripts/main.js',
      'public/javascripts/homepage.js',
      //'public/javascripts/saveGamePage.js',

      'test/scripts/*.spec.js'
    ],
    preprocessors: {
      'public/javascripts/*.js': ['babel', 'coverage'],
      'test/scripts/*.spec.js': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: ['@babel/preset-env'],
      }
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    browsers: ['ChromiumHeadless'],
    customLaunchers: {
      ChromiumHeadless: {
        base: 'Chromium',
        flags: ['--headless', '--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: true
  });
};