import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default pluginTs.config(
	{
		ignores: ["build/**", "node_modules/**"]
	},
	{
		files: ["**/*.ts"],
		extends: [pluginJs.configs.recommended, ...pluginTs.configs.recommended, ...pluginTs.configs.stylistic, eslintConfigPrettier],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
			],
			eqeqeq: ["error", "always"],
			"prefer-const": "error",
			"no-console": "off"
		}
	}
);
