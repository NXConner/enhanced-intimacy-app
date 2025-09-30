/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/android/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
}

