export default {
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
    testEnvironment: "node",
};
