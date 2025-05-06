module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:storybook/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_|args' }],
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js', 'jest.setup.js'],
      rules: {
        'global-require': 'off',
      },
    },
    {
      files: ['*.stories.js', '*.stories.jsx'],
      rules: {
        'storybook/default-exports': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
}; 