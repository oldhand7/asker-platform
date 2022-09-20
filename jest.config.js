module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,
    '\\.(png|jpg|gif)$': `<rootDir>/__mocks__/fileMock.js`,
    // Handle module aliases
    'libs/firestorage': '<rootDir>/__mocks__/libs/firestorage.js',
    'libs/firestore': '<rootDir>/__mocks__/libs/firestore.js',
    // 'libs/user': '<rootDir>/__mocks__/libs/user.js',
    '^libs/(.*)$': '<rootDir>/src/libs/$1',
    '^translation/(.*)$': '<rootDir>/src/translation/$1',
    '^components/HtmlInputField/HtmlInputField': '<rootDir>/__mocks__/HtmlInputFieldMock.jsx',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^modals/(.*)$': '<rootDir>/src/modals/$1',
    '^forms/(.*)$': '<rootDir>/src/forms/$1',
    'uuid': '<rootDir>/__mocks__/uuidMock.js',
    'next/router': '<rootDir>/__mocks__/nextRouterMock.js',
    'react-intersection-observer': '<rootDir>/__mocks__/react-intersection-observer-mock.js',
    'components/Uploader/Uploader': '<rootDir>/__mocks__/components/Uploader/Uploader.jsx',
  },
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ]
}
