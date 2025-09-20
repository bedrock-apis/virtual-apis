// @ts-nocheck This file is not needed
import { Context, ModuleSymbol } from '@bedrock-apis/virtual-apis';
import { describe, expect, it } from 'vitest';
import { Plugin } from './api';
import { PluginModule } from './module';

describe('PluginModule', () => {
   it.todo('should load right modules', () => {
      const context = new Context();
      class TestPlugin extends Plugin {}
      TestPlugin.register('test');
      context.configureAndLoadPlugins({});
      const plugin = context.getPlugin(TestPlugin);
      const plugMod1 = new PluginModule(plugin, '@minecraft/server');
      const plugMod2 = new PluginModule(plugin, '@minecraft/server', '1.15.0');
      const plugMod3 = new PluginModule(plugin, '@minecraft/server', '1.15.0', '1.19.0');

      function createModule(version: string) {
         const symbol = new ModuleSymbol().setMetadata({ version: version, name: '@minecraft/server', uuid: '0' });

         context.registerModule(symbol);
      }

      createModule('1.16.0');
      createModule('1.15.0');
      createModule('1.14.0');
      createModule('1.19.0');
      createModule('2.0.0');
      createModule('2.0.0-beta');
      createModule('2.1.0-beta');

      context.onModulesLoaded();

      // @ts-expect-error huhah
      expect(plugMod1.moduleSymbols.map(e => e.version)).toMatchInlineSnapshot(`
        [
          "2.1.0-beta",
          "2.0.0-beta",
          "2.0.0",
          "1.19.0",
          "1.16.0",
          "1.15.0",
          "1.14.0",
        ]
      `);

      // @ts-expect-error huhah
      expect(plugMod2.moduleSymbols.map(e => e.version)).toMatchInlineSnapshot(`
        [
          "2.1.0-beta",
          "2.0.0-beta",
          "2.0.0",
          "1.19.0",
          "1.16.0",
          "1.15.0",
        ]
      `);

      // @ts-expect-error huhah
      expect(plugMod3.moduleSymbols.map(e => e.version)).toMatchInlineSnapshot(`
        [
          "1.19.0",
          "1.16.0",
          "1.15.0",
        ]
      `);
   });
});
