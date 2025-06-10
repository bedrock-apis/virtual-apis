import { expect, suite, test } from 'vitest';
import { Context } from './context';
import { BooleanType, NumberType, ParamsDefinition, ParamType } from '../type-validators';
import { ErrorFactory, Report } from '../diagnostics';
import { Kernel } from '@bedrock-apis/kernel-isolation';
import { ConstructionExecutionContext } from './execution-context';

const NUMBER_TYPE = new NumberType({ max: Number.MAX_SAFE_INTEGER, min: Number.MIN_SAFE_INTEGER });

const context = new Context();
const EntityDefinition = context
   .createClassDefinition('Entity', null, null)
   .addMethod('methodA', new ParamsDefinition().addType(new ParamType(NUMBER_TYPE, false, 0, undefined)), NUMBER_TYPE);
const PlayerDefinition = context
   .createClassDefinition('Player', EntityDefinition, new ParamsDefinition(), true)
   .addMethod('methodB')
   .addProperty('test', new BooleanType(), false);

const Player = PlayerDefinition.api;
const Entity = EntityDefinition.api;

suite('Context Callback', () => {
   context.onInvocation('Entity::methodA', (handle, cache, def, exc) => (exc.result = exc.parameters[0]));
   context.onInvocation('Player::methodB', (handle, cache, def, exc) =>
      exc.report(new Report(ErrorFactory.New('Message', Kernel['ReferenceError::constructor']))),
   );
   context.onInvocation('Entity::constructor', (handle, cache, def, exec) => {
      if (exec instanceof ConstructionExecutionContext) {
         (handle as any)['name'] = 'Test';
      }
   });
   test('Method Callback', () => {
      new (class Test extends Player {})();
      const pl = new Player();
      expect(pl.methodA(5)).toBe(5);
      expect(() => pl.methodB()).toThrowErrorMatchingInlineSnapshot('[ReferenceError: Message]');
   });
});
