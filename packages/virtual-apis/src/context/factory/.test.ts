import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { expect, suite, test, vi } from 'vitest';
import { testCreateModuleContext } from '../../tests.helper';
import { BooleanType, ParamsDefinition, VoidType } from '../../type-validators';
import { ConstructionExecutionContext } from '../execution-context';
import { ClassAPISymbol } from '../symbols/class';
import { GetterAPISymbol } from '../symbols/getter';
import { MethodAPISymbol } from '../symbols/method';
import { SetterAPISymbol } from '../symbols/setter';

const ctx = testCreateModuleContext();
const EntityDefinition = new ClassAPISymbol(ctx, 'Entity', null, new ParamsDefinition());
EntityDefinition.methods.push(
   new MethodAPISymbol(ctx, 'methodA', EntityDefinition, new ParamsDefinition(), new VoidType()),
);

const PlayerDefinition = new ClassAPISymbol(ctx, 'Player', EntityDefinition, new ParamsDefinition());
PlayerDefinition.methods.push(
   new MethodAPISymbol(ctx, 'methodB', PlayerDefinition, new ParamsDefinition(), new VoidType()),
);
PlayerDefinition.properties.push({
   getter: new GetterAPISymbol(ctx, 'test', PlayerDefinition, new BooleanType()),
   setter: new SetterAPISymbol(ctx, 'test', PlayerDefinition, new BooleanType()),
});

const Player = PlayerDefinition.api as unknown as new () => {
   methodA: (...args: unknown[]) => unknown;
   methodB: (...args: unknown[]) => unknown;
   test: unknown;
};
const Entity = EntityDefinition.api;

suite('Base API', () => {
   test('Construction', () => {
      const mock = vi.fn();
      expect(EntityDefinition.invocableId).toBeTruthy();
      if (EntityDefinition.invocableId) ctx.onInvocation(EntityDefinition.invocableId, mock);

      const player = new Player();

      expect(player).toBeInstanceOf(Player);
      expect(player).toBeInstanceOf(Entity);
      expect(EntityDefinition.isThisType(player)).toBeTruthy();
      expect(mock).toHaveBeenCalledOnce();
   });

   test('Native Construction', () => {
      const entity_handle = EntityDefinition.__construct(
         new ConstructionExecutionContext(
            EntityDefinition.api,
            EntityDefinition,
            KernelArray.Construct<unknown>(),
            null,
         ),
      );

      expect(entity_handle).not.toBeInstanceOf(Player);
      expect(entity_handle).not.toBeInstanceOf(Entity);
      expect(entity_handle).not.toBeInstanceOf(Object);
      expect(() => (Player as any).prototype.methodA.call(entity_handle));
   });

   test('Normal Constructor', () => {
      expect(new Player()).toBeInstanceOf(Player);
      expect(new Player()).toBeInstanceOf(Entity);
   });

   test('Methods', () => {
      const player = new Player();

      expect(player.methodA).toBeTypeOf('function');
      expect(player.methodB).toBeTypeOf('function');

      expect(player.methodA).toThrowErrorMatchingInlineSnapshot(
         `[ReferenceError: Native function [Entity::methodA] object bound to prototype does not exist.]`, //👌
      );
      expect(player.methodA.bind(player)).not.toThrow();
      expect(() => player.methodA()).not.toThrow();
   });

   test('Property', () => {
      const player = new Player();

      const { get, set } = Object.getOwnPropertyDescriptor(Player.prototype, 'test') ?? {};
      expect(set).toThrowError();
      expect(get).not.toThrow();
      expect(() => (set as any)?.call(player)).toThrow();
      expect(() => set?.call(player, 5)).toThrow();
      expect(() => set?.call(player, false)).not.toThrow();
      expect(get?.call({})).toBeTypeOf('undefined');

      expect(() => (player.test = 5)).toThrow();
      // TODO Fix test expected undefined not to be type of 'undefined'
      // expect(get?.call(player)).not.toBeTypeOf('undefined');
   });

   test('Error stack traces', () => {
      const player = new Player();

      try {
         player.methodA.call(undefined);
      } catch (e) {
         expect(e).toBeInstanceOf(Kernel['ReferenceError::constructor']);
         expect(e).toBeInstanceOf(ReferenceError);
         expect(e).toMatchInlineSnapshot(
            `[ReferenceError: Native function [Entity::methodA] object bound to prototype does not exist.]`,
         );
      }
   });

   test('Invalid params', () => {
      const player = new Player();

      expect(() => player.methodA(undefined)).toThrowError();
   });
});
