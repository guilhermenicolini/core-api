module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/main/factories/**/*.ts',
    '!**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  reporters: ['default'],
  coverageReporters: ['lcov', 'clover', 'text-summary', 'text', 'cobertura'],
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  transform: {
    '\\.ts$': 'ts-jest'
  },
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],
  clearMocks: true,
  setupFiles: [
    '<rootDir>/tests/jest.setup.js'
  ]
}
