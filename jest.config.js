module.exports = {
  roots: ["<rootDir>/src"],

  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(uuid|xxx)/)"],
};
