import { Kernel } from '@bedrock-apis/kernel-isolation';
import { expect, suite, test } from 'vitest';
import { ErrorFactory, Report } from '../diagnostics';
import { testCreateModuleContext } from '../tests.helper';
import { BooleanType, NumberType, ParamsDefinition, ParamType, VoidType } from '../type-validators';
import { ConstructionExecutionContext } from './execution-context';
import { ClassAPISymbol } from './symbols/class';
import { GetterAPISymbol } from './symbols/getter';
import { MethodAPISymbol } from './symbols/method';
import { SetterAPISymbol } from './symbols/setter';

const NUMBER_TYPE = new NumberType({ max: Number.MAX_SAFE_INTEGER, min: Number.MIN_SAFE_INTEGER });

const ctx = testCreateModuleContext();
const EntityDefinition = new ClassAPISymbol(ctx, 'Entity');
EntityDefinition.methods.push(
   new MethodAPISymbol(
      ctx,
      'methodA',
      EntityDefinition,
      new ParamsDefinition().addType(new ParamType(NUMBER_TYPE, false, 0, undefined)),
      NUMBER_TYPE,
   ),
);

const PlayerDefinition = new ClassAPISymbol(ctx, 'Player', EntityDefinition);
PlayerDefinition.methods.push(
   new MethodAPISymbol(ctx, 'methodB', PlayerDefinition, new ParamsDefinition(), new VoidType()),
);
PlayerDefinition.properties.push({
   getter: new GetterAPISymbol(ctx, 'test', PlayerDefinition, new BooleanType()),
   setter: new SetterAPISymbol(ctx, 'test', PlayerDefinition, new BooleanType()),
});

const Player = PlayerDefinition.api;

suite('Context Callback', () => {
   ctx.onInvocation('Entity::methodA', (handle, cache, def, exc) => (exc.result = exc.parameters[0]));
   ctx.onInvocation('Player::methodB', (handle, cache, def, exc) =>
      exc.report(new Report(ErrorFactory.New('Message', Kernel['ReferenceError::constructor']))),
   );
   ctx.onInvocation('Entity::constructor', (handle, cache, def, exec) => {
      if (exec instanceof ConstructionExecutionContext) {
         (handle as any)['name'] = 'Test';
      }
   });
   test('Method Callback', () => {
      // @ts-expect-error
      new (class Test extends Player {})();
      const pl = new Player();
      expect((pl as any).methodA(5)).toBe(5);
      expect(() => (pl as any).methodB()).toThrowErrorMatchingInlineSnapshot('[ReferenceError: Message]');
   });
});
