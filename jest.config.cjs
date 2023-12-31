module.exports = {
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // ts-jest configuration goes here
      },
    ],
    "^.+\\.svg$": "<rootDir>/src/__test-stubs__/svgTransform.cjs"
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/__test-stubs__/styleStub.cjs',
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.(ts|tsx)'],
  testEnvironment: 'jsdom',
  clearMocks: true,
};
