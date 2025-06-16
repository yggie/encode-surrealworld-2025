import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "./schema.graphql",
    documents: ["src/**/*.{ts,tsx}"],
    generates: {
        "./src/features/api/__generated__/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql",
            },
        },
    },
};

export default config;
