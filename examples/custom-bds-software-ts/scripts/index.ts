import { world, WorldLoadAfterEvent } from '@minecraft/server';
world.afterEvents.worldLoad.subscribe(event => {
   console.log('event is instance', event instanceof WorldLoadAfterEvent);

   const entity = world.getDimension('overworld').spawnEntity('minecraft:cow', { x: 0, y: 0, z: 0 });
   console.log(entity);

   entity.nameTag = 'Some name';

   console.log(entity.nameTag);

   entity.addTag('sometag');
   console.log(entity.getTags());

   console.log('isValid', entity.isValid);
   entity.remove();
   console.log('isValid', entity.isValid);
});
