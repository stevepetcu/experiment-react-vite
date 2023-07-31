module.exports = {
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.(ts|tsx|js)'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
};
