// TODO Make separate export for running code on virtual apis and writing incompatability.md

// Context.configure({
//   GetterRequireValidBound: true,
//   StrictReturnTypes: false,
//});

import { CreateResolverContext } from '@bedrock-apis/va-loader/node';
import { Context } from '@bedrock-apis/virtual-apis';

const entryPoint = import.meta.resolve('@bedrock-apis/va-test/addon');
const _ = new CreateResolverContext(entryPoint, new Context());

// run
// we can use exports to run or grap test results
await import(entryPoint);
