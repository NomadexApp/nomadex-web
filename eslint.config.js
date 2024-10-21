import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020,
				extraFileExtensions: ['.svelte'],
			}
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	},
	{
		files: ['**/*.algo.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-this-alias': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'no-control-regex': 'off'
		}
	}
);
