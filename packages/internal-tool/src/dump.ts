import { dump } from '@bedrock-apis/va-bds-dumps/run';
import { corePluginVanillaDataProvider } from '@bedrock-apis/va-core-plugin/dump/provider';
import { modulesProvider } from '@bedrock-apis/va-image-generator/dump/provider';
import { testsResultProvider } from '@bedrock-apis/va-test/dump/provider';

dump({
   providers: [modulesProvider, corePluginVanillaDataProvider, testsResultProvider],
   version: '1.21.100',
});
