import { spawnEntity } from '../environment/environment';
import { TestSuite } from '../suite';

TestSuite.withSetup('entity', () => spawnEntity('minecraft:cow'))
   .test(entity => entity.typeId)
   .test(entity => entity.location)
   .test(entity => entity.localizationKey)
   .test(entity => entity.getComponents());

TestSuite.simple('disposal').testChain(function* () {
   const entity = spawnEntity('minecraft:cow');
   yield entity.isValid;

   entity.remove();
   yield entity.isValid;

   entity.addTag('abc');
});
