import {APIBuilder} from "../dist/api-builder/api-builder.js";
import {ClassDefinition} from "../dist/api-builder/class-definition.js";

const EntityDefinition = new ClassDefinition("Entity", null).addMethod("methodA");
const PlayerDefinition = new ClassDefinition("Player", EntityDefinition).addMethod("methodB");
PlayerDefinition.hasConstructor = true;

const Player = PlayerDefinition.apiClass;
const Entity = EntityDefinition.apiClass;


const player = new Player();

console.log(player instanceof Player);
console.log(player instanceof Entity);
console.log(Player.__proto__ === Entity);
console.log(player.methodB());
console.log(player.methodA());