module.exports = {
  testEnvironment: "jsdom",
  roots: ["src"],
  moduleNameMapper: {
    "@pagopa-pn/pn-commons/src/(.*)": "<rootDir>/../pn-commons/src/$1",
    "src/(.*)": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(?:ts|tsx)?$": "babel-jest",
    "\\.svg$": "<rootDir>/../../svgTransformerForTests.js",
  },
  clearMocks: true,
};
