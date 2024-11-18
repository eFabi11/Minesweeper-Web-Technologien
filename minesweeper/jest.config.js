module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable',
    runScripts: 'dangerously',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: [
    "<rootDir>/test/scripts/homepage.test.js",
  ],
  moduleFileExtensions: [
    'js',
    'vue',
    'json'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  collectCoverageFrom: [
  '<rootDir>/public/javascripts/homepage.js',
  '<rootDir>/public/javascripts/main.js',
  '<rootDir>/public/javascripts/saveGamePage.js'
  ],
  testEnvironment: 'node'
};
