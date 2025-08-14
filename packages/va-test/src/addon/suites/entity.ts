import { TestSuite } from '../addon/suite';
import { spawnEntity } from '../environment/environment';

TestSuite.withSetup('entity', () => spawnEntity('minecraft:cow'))
   .test(entity => entity.typeId)
   .test(entity => entity.location)
   .test(entity => entity.localizationKey)
   .test(entity => entity.getComponents());
