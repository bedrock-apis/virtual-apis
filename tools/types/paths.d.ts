/* eslint-ignore */
// prettier-ignore

declare global {
    declare type ProjectFilePath = F;
    declare type ProjectDirPath = D;
    declare type ProjectPath = F | D;
}
export {};

type F =
   | 'src/plugin/apis/api.ts'
   | 'src/plugin/apis/get-module-versions.ts'
   | 'src/plugin/apis/index.ts'
   | 'src/plugin/core/components.ts'
   | 'src/plugin/core/effects.ts'
   | 'src/plugin/core/events.ts'
   | 'src/plugin/core/inventory.ts'
   | 'src/plugin/core/modules.ts'
   | 'src/virtual-apis/context/class-definition.ts'
   | 'src/virtual-apis/context/context-options.ts'
   | 'src/virtual-apis/context/context.ts'
   | 'src/virtual-apis/context/execution-context/construction.ts'
   | 'src/virtual-apis/context/execution-context/general.ts'
   | 'src/virtual-apis/context/execution-context/index.ts'
   | 'src/virtual-apis/context/execution-context/instance.ts'
   | 'src/virtual-apis/context/execution-context.ts'
   | 'src/virtual-apis/context/factory/.test.ts'
   | 'src/virtual-apis/context/factory/base.ts'
   | 'src/virtual-apis/context/factory/constructor.ts'
   | 'src/virtual-apis/context/factory/function.ts'
   | 'src/virtual-apis/context/factory/index.ts'
   | 'src/virtual-apis/context/factory/method.ts'
   | 'src/virtual-apis/context/factory/properties.ts'
   | 'src/virtual-apis/context/index.ts'
   | 'src/virtual-apis/diagnostics/data.ts'
   | 'src/virtual-apis/diagnostics/diagnostics.test.ts'
   | 'src/virtual-apis/diagnostics/diagnostics.ts'
   | 'src/virtual-apis/diagnostics/factory.ts'
   | 'src/virtual-apis/diagnostics/index.ts'
   | 'src/virtual-apis/diagnostics/messages.ts'
   | 'src/virtual-apis/diagnostics/panic.ts'
   | 'src/virtual-apis/diagnostics/reports.ts'
   | 'src/virtual-apis/events.ts'
   | 'src/virtual-apis/index.ts'
   | 'src/virtual-apis/isolation/index.ts'
   | 'src/virtual-apis/isolation/kernel.arrays.ts'
   | 'src/virtual-apis/isolation/kernel.iterators.test.ts'
   | 'src/virtual-apis/isolation/kernel.iterators.ts'
   | 'src/virtual-apis/isolation/kernel.md'
   | 'src/virtual-apis/isolation/kernel.test.ts'
   | 'src/virtual-apis/isolation/kernel.ts'
   | 'src/virtual-apis/type-validators/default.ts'
   | 'src/virtual-apis/type-validators/index.ts'
   | 'src/virtual-apis/type-validators/params-definition.test.ts'
   | 'src/virtual-apis/type-validators/params-definition.ts'
   | 'src/virtual-apis/type-validators/type.test.ts'
   | 'src/virtual-apis/type-validators/type.ts'
   | 'src/virtual-apis/type-validators/types/array.test.ts'
   | 'src/virtual-apis/type-validators/types/array.ts'
   | 'src/virtual-apis/type-validators/types/boolean.test.ts'
   | 'src/virtual-apis/type-validators/types/boolean.ts'
   | 'src/virtual-apis/type-validators/types/class.ts'
   | 'src/virtual-apis/type-validators/types/dynamic.test.ts'
   | 'src/virtual-apis/type-validators/types/dynamic.ts'
   | 'src/virtual-apis/type-validators/types/function.test.ts'
   | 'src/virtual-apis/type-validators/types/function.ts'
   | 'src/virtual-apis/type-validators/types/interface.test.ts'
   | 'src/virtual-apis/type-validators/types/interface.ts'
   | 'src/virtual-apis/type-validators/types/map.test.ts'
   | 'src/virtual-apis/type-validators/types/map.ts'
   | 'src/virtual-apis/type-validators/types/number.test.ts'
   | 'src/virtual-apis/type-validators/types/number.ts'
   | 'src/virtual-apis/type-validators/types/optional.test.ts'
   | 'src/virtual-apis/type-validators/types/optional.ts'
   | 'src/virtual-apis/type-validators/types/promise.test.ts'
   | 'src/virtual-apis/type-validators/types/promise.ts'
   | 'src/virtual-apis/type-validators/types/string.test.ts'
   | 'src/virtual-apis/type-validators/types/string.ts'
   | 'src/virtual-apis/type-validators/types/tests.helper.ts'
   | 'src/virtual-apis/type-validators/types/variant.test.ts'
   | 'src/virtual-apis/type-validators/types/variant.ts'
   | 'src/vitest-loader/node/hooks.ts'
   | 'src/vitest-loader/node/loader.ts'
   | 'src/vitest-loader/vitest.ts'
   | 'tools/build/packages/codegen/base.ts'
   | 'tools/build/packages/codegen/general.ts'
   | 'tools/build/packages/codegen/helpers.ts'
   | 'tools/build/packages/codegen/imports.ts'
   | 'tools/build/packages/codegen/index.ts'
   | 'tools/build/packages/dependency-resolver.test.ts'
   | 'tools/build/packages/dependency-resolver.ts'
   | 'tools/build/packages/index.ts'
   | 'tools/build/packages/metadata-provider/general.ts'
   | 'tools/build/packages/metadata-provider/index.ts'
   | 'tools/build/packages/metadata-provider/online.ts'
   | 'tools/build/packages/metadata-provider/system-io.ts'
   | 'tools/build/packages/printer.ts'
   | 'tools/build/packages/virtual-apis/constants.ts'
   | 'tools/build/packages/virtual-apis/engine.ts'
   | 'tools/build/packages/virtual-apis/helper.ts'
   | 'tools/build/packages/virtual-apis/index.ts'
   | 'tools/build/packages/virtual-apis/module.ts'
   | 'tools/build/repo/paths.ts'
   | 'tools/build/todo/index.ts'
   | 'tools/configs/tsconfig.base.json'
   | 'tools/configs/tsconfig.build.json'
   | 'tools/configs/tsconfig.ci.json'
   | 'tools/configs/tsconfig.eslint.json'
   | 'tools/linter/config.ts'
   | 'tools/linter/plugin.ts'
   | 'tools/linter/rules/no-array-expression.ts'
   | 'tools/linter/rules/no-default-classes.ts'
   | 'tools/linter/rules/no-global.ts'
   | 'tools/linter/rules/no-unsafe-iterators.ts'
   | 'tools/types/index.d.ts'
   | 'tools/types/paths.d.ts'
   | 'tools/types/script-module-metadata.d.ts'
   | 'tools/utils/constants.ts'
   | 'tools/utils/helper.ts'
   | 'tools/utils/index.ts'
   | 'tools/utils/system-io.ts'
   | '.gitignore'
   | '.prettierignore'
   | 'eslint.config.ts'
   | 'LICENSE'
   | 'package.json'
   | 'pnpm-lock.yaml'
   | 'pnpm-workspace.yaml'
   | 'README.md'
   | 'rolldown.config.ts'
   | 'TODO.md'
   | 'tsconfig.json'
   | 'vitest.config.ts';

type D =
   | 'src/plugin'
   | 'src/plugin/apis'
   | 'src/plugin/core'
   | 'src/virtual-apis'
   | 'src/virtual-apis/context'
   | 'src/virtual-apis/context/execution-context'
   | 'src/virtual-apis/context/factory'
   | 'src/virtual-apis/diagnostics'
   | 'src/virtual-apis/isolation'
   | 'src/virtual-apis/type-validators'
   | 'src/virtual-apis/type-validators/types'
   | 'src/vitest-loader'
   | 'src/vitest-loader/node'
   | 'tools/build'
   | 'tools/build/packages'
   | 'tools/build/packages/codegen'
   | 'tools/build/packages/metadata-provider'
   | 'tools/build/packages/virtual-apis'
   | 'tools/build/repo'
   | 'tools/build/todo'
   | 'tools/configs'
   | 'tools/linter'
   | 'tools/linter/rules'
   | 'tools/types'
   | 'tools/utils'
   | 'src'
   | 'tools';
