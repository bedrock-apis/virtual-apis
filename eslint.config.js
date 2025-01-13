import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { ESLintUtils } from "@typescript-eslint/utils";

//#region tools/linter/rules/no-array-expression.ts
var no_array_expression_default = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		hasSuggestions: true,
		fixable: "code",
		messages: { arrayExpression: `Array expression is not permitted, vanilla arrays has unsafe prototype!` },
		schema: []
	},
	create(context) {
		const sourceCode = context.sourceCode;
		const checker = sourceCode.parserServices?.program?.getTypeChecker();
		const map = sourceCode.parserServices?.esTreeNodeToTSNodeMap;
		if (!map || !checker) return {};
		return { ArrayExpression(node) {
			if (node.parent.type === "TSAsExpression" && node.parent.typeAnnotation.type === "TSTypeReference" && node.parent.typeAnnotation.typeName.type === "Identifier" && node.parent.typeAnnotation.typeName.name === "const") return;
			if (node.type.startsWith("TS")) return;
			context.report({
				messageId: "arrayExpression",
				node,
				fix: (fixer) => [fixer.replaceText(node, `${kernelArrayConstruct}(${node.elements.map((e) => map.get(e)).map((e) => e.getText()).join(", ")})`)]
			});
		} };
	},
	defaultOptions: []
});

//#endregion
//#region tools/linter/rules/no-default-classes.ts
var no_default_classes_default = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		hasSuggestions: true,
		fixable: "code",
		messages: { extendsEmpty: `Use Kernel.Empty as parent class for isolation security` },
		schema: []
	},
	create(context) {
		return { ClassDeclaration(node) {
			if (node.superClass === null) context.report({
				messageId: "extendsEmpty",
				node,
				fix: (fixer) => {
					return [fixer.insertTextBefore(node.body, " extends Kernel.Empty")];
				}
			});
		} };
	},
	defaultOptions: []
});

//#endregion
//#region tools/linter/rules/no-global.ts
var no_global_default = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		hasSuggestions: true,
		fixable: "code",
		messages: { useKernel: `Standalone global {{args}} is not allowed as globalThis could be modified anytime, use Kernel access` },
		schema: []
	},
	create(context) {
		function isRestricted(name$1) {
			if (name$1 === "undefined") return false;
			return name$1 in globalThis;
		}
		const sourceCode = context.sourceCode;
		return { Program(node) {
			const scope = sourceCode.getScope(node);
			scope.variables.forEach((variable) => {
				if (!variable.defs.length && isRestricted(variable.name)) variable.references.forEach((variable$1) => reportReference(variable$1.identifier));
			});
			scope.through.forEach((reference) => {
				if (isRestricted(reference.identifier.name)) {
					if (reference.isTypeReference) return;
					reportReference(reference.identifier);
				}
			});
		} };
		function reportReference(node) {
			if (node.parent.type.startsWith("TS")) return;
			const name$1 = node.name;
			const replaceWith = kernelAccess(name$1);
			context.report({
				node,
				messageId: "useKernel",
				data: { args: name$1 },
				fix(fixer) {
					return [fixer.replaceTextRange(node.range, replaceWith)];
				}
			});
		}
	},
	defaultOptions: []
});

//#endregion
//#region tools/linter/rules/no-unsafe-iterators.ts
var no_unsafe_iterators_default = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		hasSuggestions: false,
		fixable: "code",
		messages: {
			unsafeIterator: `Using iterators is unsafe as iterators are not isolated`,
			forOfDestructor: `Using destructors in for-of is not permitted.`
		},
		schema: []
	},
	create(context) {
		const checker = context.sourceCode.parserServices?.program?.getTypeChecker();
		const map = context.sourceCode.parserServices?.esTreeNodeToTSNodeMap;
		if (!map || !checker) return {};
		const checkNode = (node) => {
			if (!node) return;
			const tsNode = map.get(node);
			const type = checker.getTypeAtLocation(tsNode);
			if (type.symbol?.name !== "KernelIterator") context.report({
				messageId: "unsafeIterator",
				node
			});
		};
		return {
			YieldExpression(node) {
				if (!node.delegate) return;
				checkNode(node.argument);
			},
			ForOfStatement(node) {
				for (const n of node.left.declarations) if (n.id.type === "ArrayPattern") context.report({
					messageId: "forOfDestructor",
					node: n.id
				});
				checkNode(node.right);
			},
			ArrayPattern(node) {
				if (node.parent.type === "VariableDeclarator") checkNode(node.parent.init);
			}
		};
	},
	defaultOptions: []
});

//#endregion
//#region tools/linter/plugin.ts
const name = "@bedrock-apis/virtual-apis/eslint-plugin";
const kernel = "Kernel";
const kernelArrayConstruct = "KernelArray.Construct";
const kernelAccess = (globalName) => `${kernel}['globalThis::${globalName}']`;
const plugin = { rules: {
	"no-globals": no_global_default,
	"no-default-extends": no_default_classes_default,
	"no-iterators": no_unsafe_iterators_default,
	"no-array-expression": no_array_expression_default
} };
const recommended = {
	plugins: { [name]: plugin },
	rules: {
		[`${name}/no-globals`]: "error",
		[`${name}/no-default-extends`]: "error",
		[`${name}/no-iterators`]: "error",
		[`${name}/no-array-expression`]: "error"
	}
};
var plugin_default = {
	recommended,
	plugin
};

//#endregion
//#region tools/linter/config.ts
var config_default = tseslint.config({ ignores: [
	"**/*.test.ts",
	"./src/utils/**/*",
	"dist/**",
	"examples/**",
	"**/*.test.ts",
	"modules/**"
] }, eslint.configs.recommended, ...tseslint.configs.strict, {
	files: ["src/**/*.ts", "tools/**/*.ts"],
	languageOptions: {
		ecmaVersion: 2024,
		sourceType: "module",
		parserOptions: { project: "./tools/configs/tsconfig.json" }
	},
	plugins: { custom: plugin_default.plugin },
	linterOptions: { reportUnusedDisableDirectives: true },
	rules: {
		"@typescript-eslint/no-extraneous-class": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/explicit-member-accessibility": ["warn", { accessibility: "explicit" }],
		"@typescript-eslint/naming-convention": ["warn", ...namingConvention()],
		"no-dupe-class-members": "off",
		"no-undef": "off",
		"no-unused-vars": "off"
	}
}, {
	files: ["src/**/*.ts"],
	ignores: ["src/vitest-loader/**", "src/utils/**"],
	rules: {
		"custom/no-globals": "error",
		"custom/no-default-extends": "warn",
		"custom/no-iterators": "error",
		"custom/no-array-expression": "error"
	}
});
function namingConvention() {
	return [
		{
			selector: "variable",
			modifiers: ["const", "global"],
			format: ["UPPER_CASE", "PascalCase"]
		},
		{
			selector: "variable",
			modifiers: ["const"],
			format: ["camelCase"]
		},
		{
			selector: "variable",
			modifiers: ["destructured"],
			format: [
				"camelCase",
				"PascalCase",
				"snake_case"
			]
		},
		{
			selector: "variable",
			format: ["camelCase"]
		},
		{
			selector: "function",
			format: ["camelCase"]
		},
		{
			selector: "classMethod",
			modifiers: ["static"],
			format: ["PascalCase"]
		},
		{
			selector: "classMethod",
			format: ["camelCase"],
			leadingUnderscore: "allowDouble"
		},
		{
			selector: "classProperty",
			modifiers: ["readonly", "private"],
			format: ["UPPER_CASE"]
		},
		{
			selector: "classProperty",
			modifiers: ["readonly", "public"],
			format: ["camelCase"]
		},
		{
			selector: "import",
			format: ["camelCase", "PascalCase"]
		},
		{
			selector: "typeLike",
			format: ["PascalCase"]
		}
	];
}

//#endregion
export { config_default as default };