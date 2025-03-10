import type { Config } from "jest"
import { defaults } from "jest-config"

const config: Config = {
    moduleFileExtensions: [...defaults.moduleFileExtensions, "mts"],
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "node_modules/variables/.+\.(j|t)sx?$": "ts-jest"
    },
    transformIgnorePatterns: ["node_modules/(?!variables/.*)"]
}

export default config
