import { world } from '@minecraft/server';

console.log('DAY IS', world.getDay());

const entity = world.getDimension('minecraft:overworld').spawnEntity('minecraft:cow', { x: 0, y: 0, z: 0 });

console.log(entity);
console.log('isSneaking', entity.isSneaking);
entity.isSneaking = true;
console.log('isSneaking', entity.isSneaking);
