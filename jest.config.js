module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/jest.setup.js'
  ],
  testMatch: [
    '**/src/**/*.test.js', // Look for .test.js files only within src
    '**/src/**/*.test.jsx' // Also look for .test.jsx files
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$       ': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$       ': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
}; 