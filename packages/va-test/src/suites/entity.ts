import { spawnEntity } from '../environment';
import { TestSuite } from '../suite';

TestSuite.WithSetup('entity', () => spawnEntity('minecraft:cow'))
   .test(entity => entity.typeId)
   .test(entity => entity.location)
   .test(entity => entity.localizationKey)
   .test(entity => entity.getComponents());
