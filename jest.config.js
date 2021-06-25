module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  clearMocks: true,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['build'],
};
